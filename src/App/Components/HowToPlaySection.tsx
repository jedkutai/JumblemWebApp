import { Typography } from "@mui/material";
import { VStack } from "../../ReactSwiftly";

interface HowToPLaySectionProps {
    title: string;
    descriptions: string[];
}

export default function HowToPLaySection({title, descriptions}: HowToPLaySectionProps) {
    
    return (
        <VStack spacing="0px">
            <Typography variant="h3" style={{ color: "black" }}>
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