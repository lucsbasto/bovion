import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Tailwind,
} from "@react-email/components";

interface VerifyEmailProps {
  name: string;
  url: string;
}

export function VerifyEmail({ name, url }: VerifyEmailProps) {
  return (
    <Tailwind>
      <Html lang="pt-BR">
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4 max-w-xl">
            <Heading className="text-2xl font-bold text-gray-900 mb-4">
              Verificar seu e-mail
            </Heading>
            <Text className="text-gray-700 mb-4">
              Olá, {name}. Obrigado por se cadastrar no Bovion!
            </Text>
            <Text className="text-gray-700 mb-6">
              Para concluir seu cadastro, confirme seu endereço de e-mail clicando no botão abaixo.
            </Text>
            <Button
              href={url}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md no-underline"
            >
              Verificar e-mail
            </Button>
            <Text className="text-gray-500 text-sm mt-6">
              Se você não criou uma conta no Bovion, ignore este e-mail.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

export default VerifyEmail;
