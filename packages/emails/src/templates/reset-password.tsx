import { Body, Button, Container, Heading, Html, Tailwind, Text } from "@react-email/components";

interface ResetPasswordEmailProps {
  name: string;
  url: string;
}

export function ResetPasswordEmail({ name, url }: ResetPasswordEmailProps) {
  return (
    <Tailwind>
      <Html lang="pt-BR">
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            <Heading className="text-2xl font-bold text-gray-900 mb-4">Redefinir sua senha</Heading>
            <Text className="text-gray-700 mb-4">
              Olá, {name}. Recebemos uma solicitação para redefinir a senha da sua conta no Bovion.
            </Text>
            <Text className="text-gray-700 mb-6">
              Clique no botão abaixo para criar uma nova senha. Este link expira em 1 hora.
            </Text>
            <Button
              href={url}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md no-underline"
            >
              Redefinir senha
            </Button>
            <Text className="text-gray-500 text-sm mt-6">
              Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanece
              a mesma.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

export default ResetPasswordEmail;
