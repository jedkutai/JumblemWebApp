// import { Button, CircularProgress } from "@mui/material";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserModel, GameModel } from "../../../../Background/Models";
// import { GuestService } from "../../../../Background/Service";
// import { View, VStack } from "../../../../ReactSwiftly";
// import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
// import GuestPlayCasualGameView from "./GuestPlayCasualGameView";
// import BotPlayCasualGameView from "../../../Views/Game/CasualGame/CasualBot/BotPlayCasualGameView";
// import GameRequirementsWarning from "../../../Components/GameRequirementsWarning";

// interface GuestStartCasualGameViewProps {
//     passedUser: UserModel
// }

// enum GuestCasualGameModeState {
//     idle,
//     findingMatch,
//     matchFound,
//     playBot,
//     error
// }

// export default function GuestStartCasualGameView({ passedUser }: GuestStartCasualGameViewProps) {
//     const [gameModeState, setGameModeState] = useState<GuestCasualGameModeState>(GuestCasualGameModeState.idle);
//     const [game, setGame] = useState<GameModel | null>(null);
//     const [hostOfMatch, setHostOfMatch] = useState(false);
//     const [stopSearching, setStopSearching] = useState(false);
//     const [takingLongToFindMatch, setTakingLongToFindMatch] = useState(false);
//     const [ticker, setTicker] = useState(false);
//     const [tickCount, setTickCount] = useState(0);
//     const [botMatchCreated, setBotMatchCreated] = useState(false);
//     const navigate = useNavigate();
//     const botMatchCreationDelay = Math.floor(Math.random() * 5) + 5;


//     useEffect(() => {
//         tickerActions();
//     }, [ticker]);

//     const dismiss = async () => {
//         wipeGame();
//         navigate("/home");
//     }


//     const onAppearActions = async () => {
//         if (gameModeState !== GuestCasualGameModeState.findingMatch) {
//             setStopSearching(false);
//             setGameModeState(GuestCasualGameModeState.findingMatch);
//         }
//         try {

//             const loadedGame = await GuestService.findGame(passedUser);
//             setGame(loadedGame);
//             if (loadedGame) {
//                 const gameUpdate = await GuestService.getGameUpdate(loadedGame);
//                 if (gameUpdate.playerTwoId) {
//                     if (gameUpdate.playerTwoId === passedUser.id) {
//                         setGameModeState(GuestCasualGameModeState.matchFound);
//                         setStopSearching(true);
//                     } else {
//                         setGame(null);
//                     }
//                 } else {
//                     setGame(null);
//                 }
//             } else {
//                 const createdGame = await GuestService.createGame(passedUser);
//                 setGame(createdGame);
//                 setHostOfMatch(true);
//                 setTicker(!ticker);
//             }
//         } catch (error) {
//             setStopSearching(true);
//             setGameModeState(GuestCasualGameModeState.error);
//             wipeGame();
//         }
//     }

//     const wipeGame = async () => {
//         setStopSearching(true);
//         if (hostOfMatch) {
//             if (game) {
//                 try {
//                     await GuestService.destroyGame(game);
//                     setGame(null);
//                     setHostOfMatch(false);
//                 } catch {
//                     wipeGame();
//                 }
//             }
//         }
//     }

//     const tickerActions = async () => {
//         if (!stopSearching) {
//             if (game) {
//                 const timeout = setTimeout(async () => {
//                     try {
//                         const gameUpdate = await GuestService.getGameUpdate(game);
//                         if (gameUpdate.matchFound && gameUpdate.playerTwoId !== undefined) {
//                             if (gameUpdate.playerTwoId.startsWith("BOT-")) {
//                                 setGame(gameUpdate);
//                                 setGameModeState(GuestCasualGameModeState.playBot);
//                                 setStopSearching(true);
//                             } else {
//                                 setGame(gameUpdate);
//                                 setGameModeState(GuestCasualGameModeState.matchFound);
//                                 setStopSearching(true);
//                             }
//                             // setGame(gameUpdate);
//                             // setGameModeState(GuestCasualGameModeState.matchFound);
//                             // setStopSearching(true);
//                         } else {
//                             if (tickCount > botMatchCreationDelay && !botMatchCreated) {
//                                 await GuestService.botJoinMatch(passedUser, game);
//                                 setBotMatchCreated(true);
//                             }
//                             setTicker(!ticker);
//                             setTickCount(tickCount + 1);
//                         }
//                     } catch (error) {
//                         setStopSearching(true);
//                         setGameModeState(GuestCasualGameModeState.error);
//                     }
//                 }, 1000);

//                 return () => clearTimeout(timeout);
//             }

//             if (tickCount > 10 && !takingLongToFindMatch) {
//                 setTakingLongToFindMatch(true);
//             }
//         } else {
//             wipeGame();
//         }
//     }


//     if (gameModeState === GuestCasualGameModeState.matchFound && game) {
//         return <GuestPlayCasualGameView passedUser={passedUser} passedGame={game} />;
//     } else if (gameModeState === GuestCasualGameModeState.playBot && game) {
//         return <BotPlayCasualGameView passedUser={passedUser} passedGame={game} />;
//     }

//     return (
//         <View>
//             <VStack>
//                 <JumblemLogoSimple />
//                 {gameModeState === GuestCasualGameModeState.idle && (
//                     <>
//                         <Button
//                             color="primary"
//                             variant="contained"
//                             onClick={onAppearActions}
//                         >
//                             Find Casual Match
//                         </Button>
//                     </>
//                 )}

//                 {gameModeState === GuestCasualGameModeState.findingMatch && (
//                     <>
//                         <GameRequirementsWarning />
//                         <CircularProgress sx={{ color: "black" }} />
//                     </>
//                 )}


//                 {gameModeState === GuestCasualGameModeState.error && (
//                     <>
//                         <p>There was an error when finding a match.</p>
//                         <Button
//                             color="primary"
//                             variant="contained"
//                             onClick={onAppearActions}
//                         >
//                             Retry
//                         </Button>

//                         <p>or</p>
//                     </>
//                 )}


//                 <Button
//                     variant="contained"
//                     color="error"
//                     onClick={dismiss}
//                     style={{ marginTop: "10px" }}
//                 >
//                     Cancel
//                 </Button>
//             </VStack>
//         </View>
//     );

// }