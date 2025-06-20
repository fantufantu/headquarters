import { useTheme, Form, Input, Button, PasswordInput } from "musae";
import styles from "./styles.module.css";
import { useEvent } from "@aiszlab/relax";
import { stringify } from "@aiszlab/relax/class-name";
import { KeyboardDoubleArrowRight } from "musae/icons";
import { Link } from "@aiszlab/bee/router";
import { useMutation } from "@apollo/client";
import { SEND_REIGSTER_CAPTCHA, SIGN_UP } from "../../api/authentication";
import { useWho } from "../../hooks/authentication.hooks";
import { redirectBy, RedirectToken } from "../../utils/redirect-by";
import { AuthenticationToken } from "../../store/tokens";
import CaptchaField from "../../components/authentication/captcha-field";

interface FormValues {
  username: string;
  emailAddress: string;
  captcha: string;
  password: string;
}

const SignIn = () => {
  const theme = useTheme();
  const form = Form.useForm<FormValues>();
  const [_signUp] = useMutation(SIGN_UP);
  const { whoAmI } = useWho();
  const [_sendCaptcha] = useMutation(SEND_REIGSTER_CAPTCHA);

  const sendCaptcha = useEvent(async (to: string) => {
    return !!(
      await _sendCaptcha({
        variables: {
          to,
        },
      })
    )?.data?.sendRegisterCaptcha;
  });

  const signUp = useEvent(async () => {
    const isValid = await form.validate().catch(() => false);
    if (!isValid) return;

    const {
      username = "",
      captcha = "",
      emailAddress = "",
      password = "",
    } = form.getFieldsValue();
    const authenticated = (
      await _signUp({
        variables: {
          registerInput: {
            username,
            emailAddress,
            password,
            captcha,
          },
        },
      }).catch(() => null)
    )?.data?.register;

    if (!authenticated) return;

    await whoAmI(authenticated);
    globalThis.window.sessionStorage.setItem(
      AuthenticationToken.Authenticated,
      authenticated
    );

    // 重定向-单点登录
    redirectBy(({ isSameOrigin }) => ({
      ...(!isSameOrigin && { [RedirectToken.Redirect]: authenticated }),
    }));
  });

  return (
    <main className="h-screen w-screen flex flex-row">
      <div
        className={stringify(
          "flex-1 flex justify-center items-center",
          styles.cover
        )}
      >
        <div className="relative my-52 mx-40">
          <img width="100%" height="auto" src="/account.png" alt="Sign In" />
          <span
            className="absolute left-0 top-0 text-5xl font-bold -translate-y-full -translate-x-4"
            style={{
              color: theme.colors["on-primary"],
            }}
          >
            Welcome
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="px-20 py-10 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="ml-auto font-medium"
              style={{
                color: theme.colors["outline-variant"],
              }}
            >
              I have an account!
            </span>

            <Link
              className="font-semibold"
              to={`/sign-in${window.location.search}`}
              style={{
                color: theme.colors.primary,
              }}
            >
              Sign In
            </Link>
          </div>

          <section className="mt-28">
            <h3 className="text-2xl font-bold">Create your Account</h3>

            <Form className="mt-10" form={form}>
              <Form.Item label="Username" required name="username">
                <Input className="w-full" />
              </Form.Item>

              <Form.Item label="Email Address" required name="emailAddress">
                <Input className="w-full" />
              </Form.Item>

              <Form.Item label="Password" required name="password">
                <PasswordInput className="w-full" />
              </Form.Item>

              <CaptchaField dependency="emailAddress" onSend={sendCaptcha} />

              <Form.Item>
                <Button
                  className="w-52"
                  suffix={<KeyboardDoubleArrowRight />}
                  onClick={signUp}
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
