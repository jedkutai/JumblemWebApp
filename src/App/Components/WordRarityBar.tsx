import { HStack } from "../../ReactSwiftly";

export default function WordRarityBar() {

    return (
        <HStack spacing="5px">
            <h5 style={{ color: "rgba(255,59,48,255)", margin: 0, padding: 0 }}>Legendary</h5>
            <h5 style={{ color: "rgba(175,82,221,255)", margin: 0, padding: 0 }}>Rare</h5>
            <h5 style={{ color: "black", margin: 0, padding: 0 }}>Uncommon</h5>
            <h5 style={{ color: "rgba(142,142,147,255)", margin: 0, padding: 0 }}>Common</h5>
        </HStack>
    );
}
