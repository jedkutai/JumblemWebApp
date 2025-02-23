// import { useEffect, useState } from "react";
// import { GameModel, UserModel } from "../../../../Background/Models";
// import { View, VStack } from "../../../../ReactSwiftly";
// import { Button, CircularProgress } from "@mui/material";
// import { RatedGameService, FetchService } from "../../../../Background/Service";
// import PlayRatedGameView from "./PlayRatedGameView";
// import { useNavigate } from "react-router-dom";
// import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
// import GameRequirementsWarning from "../../../Components/GameRequirementsWarning";

// interface StartRatedGameViewProps {
//     passedUser: UserModel
// }

// enum RatedGameModeState {
//     idle,
//     findingMatch,
//     matchFound,
//     error
// }

// export default function StartRatedGameView({ passedUser }: StartRatedGameViewProps) {
//     const [user, setUser] = useState<UserModel>(passedUser);
//     const [gameModeState, setGameModeState] = useState<RatedGameModeState>(RatedGameModeState.idle);
//     const [game, setGame] = useState<GameModel | null>(null);
//     const [hostOfMatch, setHostOfMatch] = useState(false);
//     const [stopSearching, setStopSearching] = useState(false);
//     const [takingLongToFindMatch, setTakingLongToFindMatch] = useState(false);
//     const [ticker, setTicker] = useState(false);
//     const [tickCount, setTickCount] = useState(0);
//     const navigate = useNavigate();
//     // useEffect(() => {
//     //     onAppearActions();
//     // }, []);

//     useEffect(() => {
//         tickerActions();
//     }, [ticker]);

//     const dismiss = async () => {
//         wipeGame();
//         navigate("/home");
//     }


//     const onAppearActions = async () => {
//         if (gameModeState !== RatedGameModeState.findingMatch) {
//             setStopSearching(false);
//             setGameModeState(RatedGameModeState.findingMatch);
//         }
//         try {
//             const updatedUser = await FetchService.fetchUserByUid(user.id);
//             setUser(updatedUser);

//             const loadedGame = await RatedGameService.findGame(user);
//             setGame(loadedGame);
//             if (loadedGame) {
//                 const gameUpdate = await RatedGameService.getGameUpdate(loadedGame);
//                 if (gameUpdate.playerTwoId) {
//                     if (gameUpdate.playerTwoId === user.id) {
//                         setGameModeState(RatedGameModeState.matchFound);
//                         setStopSearching(true);
//                     } else {
//                         setGame(null);
//                     }
//                 } else {
//                     setGame(null);
//                 }
//             } else {
//                 const createdGame = await RatedGameService.createGame(user);
//                 setGame(createdGame);
//                 setHostOfMatch(true);
//                 setTicker(!ticker);
//             }
//         } catch (error) {
//             setStopSearching(true);
//             setGameModeState(RatedGameModeState.error);
//             wipeGame();
//         }
//     }

//     const wipeGame = async () => {
//         setStopSearching(true);
//         if (hostOfMatch) {
//             if (game) {
//                 try {
//                     await RatedGameService.destroyGame(game);
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
//                         const gameUpdate = await RatedGameService.getGameUpdate(game);
//                         if (gameUpdate.matchFound && gameUpdate.playerTwoId !== undefined) {
//                             setGame(gameUpdate);
//                             setGameModeState(RatedGameModeState.matchFound);
//                             setStopSearching(true);
//                         } else {
//                             setTicker(!ticker);
//                             setTickCount(tickCount + 1);
//                         }
//                     } catch (error) {
//                         setStopSearching(true);
//                         setGameModeState(RatedGameModeState.error);
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

//     if (gameModeState === RatedGameModeState.matchFound && game) {
//         return <PlayRatedGameView passedUser={user} passedGame={game} />;
//     }

//     return (
//         <View>
//             <VStack>

//                 <Button onClick={dismiss}>
//                     <JumblemLogoSimple />
//                 </Button>
//                 {gameModeState === RatedGameModeState.idle && (
//                     <>
//                         <Button
//                             color="primary"
//                             variant="contained"
//                             onClick={onAppearActions}
//                         >
//                             Find Rated Match
//                         </Button>
//                     </>
//                 )}

//                 {gameModeState === RatedGameModeState.findingMatch && (
//                     <>
//                         <GameRequirementsWarning />
//                         <CircularProgress sx={{ color: "black" }} />
//                     </>
//                 )}


//                 {gameModeState === RatedGameModeState.error && (
//                     <>
//                         <p>There was an error when finding a match.</p>
//                         <Button
//                             color="primary"
//                             variant="outlined"
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