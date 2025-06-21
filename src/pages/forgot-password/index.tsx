import { useMutation } from "@apollo/client";
import { Button, Form, Input, PasswordInput, useTheme } from "musae";
import {
  CHANGE_PASSWORD,
  SEND_CHANGE_PASSWORD_CAPTCHA,
} from "../../api/authentication";
import { useEvent } from "@aiszlab/relax";
import { stringify } from "@aiszlab/relax/class-name";
import styles from "./styles.module.css";
import { Link, useNavigate } from "@aiszlab/bee/router";
import CaptchaField from "../../components/authentication/captcha-field";
import { KeyboardDoubleArrowRight } from "musae/icons";

interface FormValues {
  emailAddress: string;
  password: string;
  repeatPassword: string;
  captcha: string;
}

const ForgotPassword = () => {
  const theme = useTheme();
  const form = Form.useForm<FormValues>();
  const [_changePassword] = useMutation(CHANGE_PASSWORD);
  const [_sendCaptcha] = useMutation(SEND_CHANGE_PASSWORD_CAPTCHA);
  const navigate = useNavigate();

  const submit = useEvent(async () => {
    const isValid = await form.validate().catch(() => false);
    if (!isValid) return;

    const {
      captcha = "",
      emailAddress = "",
      password = "",
    } = form.getFieldsValue();

    const isSucceed =
      (
        await _changePassword({
          variables: {
            changePasswordInput: {
              who: emailAddress,
              password,
              captcha,
            },
          },
        }).catch(() => null)
      )?.data?.changePassword ?? false;

    if (!isSucceed) return;

    // 重定向到登录页面
    navigate("/sign-in");
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
        <div className="px-20 py-10 flex-1 flex flex-col">
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

          <section className="my-auto">
            <h3 className="text-2xl font-bold">Forgot Your Password</h3>

            <Form className="mt-10" form={form}>
              <Form.Item label="Email Address" required name="emailAddress">
                <Input className="w-full" />
              </Form.Item>

              <CaptchaField dependency="emailAddress" />

              <Form.Item label="Password" required name="password">
                <PasswordInput className="w-full" />
              </Form.Item>

              <Form.Item
                label="Repeat Password"
                required
                name="repeatPassword"
                rules={[
                  {
                    validate: (_v) => _v === form.getFieldValue("password"),
                    message: "密码不一致",
                  },
                ]}
              >
                <PasswordInput className="w-full" />
              </Form.Item>

              <Form.Item>
                <Button
                  className="w-52"
                  suffix={<KeyboardDoubleArrowRight />}
                  onClick={submit}
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
