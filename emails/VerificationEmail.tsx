import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here's your verification code: {otp}</Preview>
      <Section
        style={{
          backgroundColor: "#ffffff",
          padding: "40px 20px",
          fontFamily: "Roboto, Verdana, sans-serif",
        }}
      >
        <Container>
          <Row>
            <Heading as="h2" style={{ color: "#333333", marginBottom: "20px" }}>
              Hello {username},
            </Heading>
          </Row>
          <Row>
            <Text
              style={{ color: "#666666", fontSize: "16px", lineHeight: "24px" }}
            >
              Thank you for registering. Please use the following verification
              code to complete your registration:
            </Text>
          </Row>
          <Row>
            <Text
              style={{
                backgroundColor: "#f4f4f4",
                padding: "12px 24px",
                borderRadius: "4px",
                fontSize: "24px",
                fontWeight: "bold",
                letterSpacing: "4px",
                textAlign: "center",
                margin: "20px 0",
                color: "#333333",
              }}
            >
              {otp}
            </Text>
          </Row>
          <Row>
            <Text style={{ color: "#666666", fontSize: "14px" }}>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
        </Container>
      </Section>
    </Html>
  );
}
