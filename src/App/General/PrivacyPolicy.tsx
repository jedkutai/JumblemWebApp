import { Typography } from "@mui/material";
import { useWindowSize } from "../../Background/Utils/useWindowSize";
import { View, VStack } from "../../ReactSwiftly";
import JumblemLogoSimple from "../Components/JumblemLogoSimple";
import TermsAndConditionsSection from "../Components/General/TermsAndConditionsSection";


export default function PrivacyPolicy() {
    const { width } = useWindowSize();

    return (
        <View startAtTop={true}>
            <VStack spacing="0px" alignment="flex-start" width={`${Math.min(800, width - 40)}px`}>
                <VStack>
                    <JumblemLogoSimple />

                    <Typography variant="h2" style={{ color: "black", fontWeight: "bold" }}>
                        Privacy Policy
                    </Typography>
                </VStack>

                <TermsAndConditionsSection
                    title={"Last Updated: March 1, 2025"}
                    details={[
                        "Welcome to Jumblem! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you access and use the Jumblem website, mobile application, and related services (collectively, \"Jumblem\"). By using Jumblem, you agree to the collection and use of information in accordance with this policy."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"1. Information We Collect"}
                    details={[
                        "Personal Information: When you create an account, we may collect your name, email address, and other necessary details.",
                        "Usage Data: Information on how you use Jumblem, such as gameplay statistics, interactions, and preferences.",
                        "Device and Log Data: We may collect information about your device, IP address, browser type, and app performance."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"2. How We Use Your Information. We use your data to:"}
                    details={[
                        "Provide, maintain, and improve Jumblem.",
                        "Personalize your experience.",
                        "Monitor and analyze usage trends.",
                        "Detect and prevent fraud or violations of our Terms and Conditions.",
                        "Communicate updates, offers, and important notices."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"3. Sharing and Disclosure. We do not sell your personal data. However, we may share information:"}
                    details={[
                        "With service providers that help operate our platform.",
                        "If required by law, to protect legal rights, or in response to legal requests.",
                        "In the event of a merger, sale, or business transfer, where your data may be transferred to another entity."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"4. Data Security"}
                    details={[
                        "We take appropriate measures to protect your information from unauthorized access, alteration, or loss. However, no system is entirely secure, and we cannot guarantee absolute security."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"5. Your Rights and Choices Depending on your location, you may have rights to:"}
                    details={[
                        "Access, correct, or delete your personal data.",
                        "Opt-out of certain data processing activities.",
                        "Withdraw consent where applicable.",
                        "Request information about our data practices."
                    ]}
                />

                <div style={{ height: "20px" }}></div>
                <Typography variant="h6" style={{ color: "black" }}>
                    {"To exercise these rights, please contact us at info@jumblem.com."}
                </Typography>

                <TermsAndConditionsSection
                    title={"6. Children's Privacy"}
                    details={[
                        "Jumblem is not intended for children under 6. We do not knowingly collect personal data from minors. If we become aware that a child has provided personal data, we will take steps to remove it."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"7. Third-Party Links and Services"}
                    details={[
                        "Jumblem may contain links to third-party websites or services. We are not responsible for their privacy practices, and we encourage you to review their policies."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"8. Changes to This Privacy Policy"}
                    details={[
                        "We may update this Privacy Policy from time to time. Any changes will be posted on this page, and continued use of Jumblem after changes take effect constitutes acceptance of the revised policy."
                    ]}
                />

                <TermsAndConditionsSection
                    title={"9. Contact Us"}
                    details={[
                        "If you have any questions or concerns about this Privacy Policy, please contact us at info@jumblem.com."
                    ]}
                />

                <div style={{ height: "20px" }}></div>
                <Typography variant="h6" style={{ color: "black" }}>
                    {"By using Jumblem, you acknowledge that you have read and agreed to this Privacy Policy."}
                </Typography>
            </VStack>
        </View>
    );
}