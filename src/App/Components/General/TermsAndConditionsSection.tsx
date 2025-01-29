import { Typography } from "@mui/material";
import { VStack } from "../../../ReactSwiftly";

interface TermsAndConditionsSectionProps {
    title: string;
    details: string[]
}

export default function TermsAndConditionsSection({ title, details }: TermsAndConditionsSectionProps) {

    return (
        <VStack alignment="flex-start">
            <div style={{ height: "20px"}}></div>

            <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
                {title}
            </Typography>

            {details.length === 1 && (
                <Typography variant="h6" style={{ color: "black" }}>
                    {details[0]}
                </Typography>
            )}
            {details.length > 1 && (
                <>
                    {details.map((detail, index) => (
                        <Typography key={index} variant="h6" style={{ color: "black" }}>
                            {` • ${detail}`}
                        </Typography>
                    ))}
                </>
            )}


        </VStack>
    );
}