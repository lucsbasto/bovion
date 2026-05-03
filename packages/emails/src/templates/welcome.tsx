import { Body, Container, Heading, Html, Tailwind, Text } from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Tailwind>
      <Html lang="pt-BR">
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            <Heading className="text-2xl font-bold text-gray-900 mb-4">
              Bem-vindo ao Bovion, {name}!
            </Heading>
            <Text className="text-gray-700 mb-4">
              Estamos felizes em tê-lo conosco. Sua conta foi criada com sucesso.
            </Text>
            <Text className="text-gray-700 mb-4">
              Com o Bovion, você pode gerenciar sua fazenda de forma simples e eficiente.
            </Text>
            <Text className="text-gray-500 text-sm">
              Se você não criou esta conta, por favor ignore este e-mail.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

export default WelcomeEmail;
