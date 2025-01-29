import { Typography } from "@mui/material";
import { VStack } from "../../ReactSwiftly";

interface HowToPLaySectionProps {
    title: string;
    descriptions: string[];
}

export default function HowToPLaySection({title, descriptions}: HowToPLaySectionProps) {
    
    return (
        <VStack spacing="0px" alignment="flex-start">
            <div style={{ height: "20px"}}></div>
            <Typography variant="h5" style={{ color: "black", fontWeight: "bold" }}>
                {title}
            </Typography>

            {descriptions.map((description, index) => (
                <Typography key={index} variant="h6" style={{ color: "black" }}>
                {` • ${description}`}
            </Typography>
            ))}
        </VStack>
    );
}