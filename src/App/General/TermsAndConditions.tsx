import { Typography } from "@mui/material";
import { View, VStack } from "../../ReactSwiftly";
import { useWindowSize } from "../../Background/Utils/useWindowSize";
import TermsAndConditionsSection from "../Components/General/TermsAndConditionsSection";
import JumblemLogoSimple from "../Components/JumblemLogoSimple";


export default function TermsAndConditions() {
    const { width } = useWindowSize();

    return (
        <View startAtTop={true}>

            <VStack spacing="0px" alignment="flex-start" width={`${Math.min(800, width - 40)}px`}>
                <VStack>
                    <JumblemLogoSimple />

                    <Typography variant="h2" style={{ color: "black", fontWeight: "bold" }}>
                        Terms and Conditions
                    </Typography>
                </VStack>

                <TermsAndConditionsSection
                    title={"Last Updated: March 1, 2025"}
                    details={[
                        "Welcome to Jumblem! These Terms and Conditions (\"Terms\") govern your use of the Jumblem website, mobile application, and any related services (collectively, \"Jumblem\"). By accessing or using Jumblem, you agree to abide by these Terms. If you do not agree, please refrain from using our services."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"1. Acceptance of Terms"}
                    details={[
                        "By using Jumblem, you acknowledge that you have read, understood, and agree to be bound by these Terms. We reserve the right to modify these Terms at any time, and your continued use of Jumblem constitutes acceptance of any changes."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"2. Eligibility"}
                    details={[
                        "You must be at least 6 years old to use Jumblem. By using our services, you confirm that you meet this age requirement and are legally capable of entering into a binding agreement."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"3. User Accounts"}
                    details={[
                        "You may be required to create an account to access certain features.",
                        "You are responsible for maintaining the confidentiality of your account credentials.",
                        "You must notify us immediately of any unauthorized access or security breach."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"4. Acceptable Use. By using Jumblem, you agree not to:"}
                    details={[
                        "Use the platform for any unlawful or fraudulent activities.",
                        "Disrupt, interfere with, or attempt to gain unauthorized access to our services or users.",
                        "Post or share content that is offensive, harmful, or infringes on intellectual property rights."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"5. Cheating Prohibited"}
                    details={[
                        "Any form of cheating, including but not limited to exploiting vulnerabilities, using unauthorized third-party software, or manipulating game mechanics, is strictly prohibited.",
                        "Users found cheating may face account suspension or permanent bans.",
                        "We reserve the right to investigate and take appropriate action against users suspected of cheating."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"6. Intellectual Property"}
                    details={[
                        "All content, trademarks, and services provided by Jumblem are owned or licensed by us. You may not reproduce, distribute, or create derivative works without prior permission."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"7. Privacy Policy"}
                    details={[
                        "Your use of Jumblem is subject to our Privacy Policy, which explains how we collect, use, and protect your data. By using Jumblem, you consent to our data practices as described in the Privacy Policy."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"8. Termination"}
                    details={[
                        "We reserve the right to suspend or terminate your access to Jumblem at our discretion if you violate these Terms or engage in any activity that we deem harmful to our services or users."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"9. Disclaimers and Limitation of Liability"}
                    details={[
                        "Jumblem is provided \"as is\" without any warranties, express or implied.",
                        "We do not guarantee uninterrupted service or that the platform will be free from errors.",
                        "To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of Jumblem."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"10. Governing Law"}
                    details={[
                        "These Terms shall be governed by and construed in accordance with the laws of the United States of America. Any disputes shall be resolved in the courts of the United States of America."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"11. Contact Information"}
                    details={[
                        "If you have any questions or concerns about these Terms, please contact us at info@jumblem.com."
                    ]}
                />

                <div style={{ height: "20px" }}></div>
                <Typography variant="h6" style={{ color: "black" }}>
                    {"By using Jumblem, you acknowledge that you have read and agreed to these Terms and Conditions."}
                </Typography>
            </VStack>
        </View>
    );
}