import { Typography } from "@mui/material";
import { DictionaryWordModel, WordModel } from "../../../Background/Models";
import { View, VStack } from "../../../ReactSwiftly";

interface SpecificWordViewProps {
    dictionaryModels: DictionaryWordModel[];
    wordModel: WordModel;

}

export default function SpecificWordView({ dictionaryModels, wordModel }: SpecificWordViewProps) {

    return (
        <View>
            <VStack padding="20px" alignment="flex-start">
                <Typography variant="h1" style={{ color: "gray"}}>{wordModel.word}</Typography>

                {dictionaryModels.map((dictionaryModel, index) => (
                    <VStack key={index} alignment="flex-start">

                        {dictionaryModel.meanings.map((meaning, index) => (
                            <VStack key={index} alignment="flex-start">
                                <Typography variant="h3" style={{fontWeight: "bolder"}} textAlign={"left"}>{`[${meaning.partOfSpeech}]`}</Typography>
                                {meaning.definitions.map((definition, index) => (
                                    <div key={index} style={{margin: "10px 0px"}}>
                                        <Typography textAlign={"left"}>{`[${index+1}] ${definition.definition}`}</Typography>
                                        {definition.example && (
                                            <Typography textAlign={"left"} style={{color: "gray"}}>{`[Ex.] ${definition.example}`}</Typography>
                                        )}
                                    </div>
                                ))}
                            </VStack>


                        ))}
                    </VStack>
                ))}
            </VStack>
        </View>
    );
}