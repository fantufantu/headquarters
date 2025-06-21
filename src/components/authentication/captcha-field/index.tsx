import { Countdown, Form, OtpInput, useMessage } from "musae";

interface Props {
  dependency: string;
  onSend: (to: string) => Promise<boolean>;
}

const CaptchaField = ({ dependency, onSend }: Props) => {
  const to = Form.useWatch(dependency);
  const [messager] = useMessage();

  const sendCaptcha = async () => {
    const isSucceed = await onSend(to).catch(() => false);
    if (!isSucceed) return;
    messager.success({ description: "验证码已发送至您邮箱" });
  };

  return (
    <Form.Item
      label="Captcha"
      name="captcha"
      className="flex justify-between items-center gap-2"
      required
    >
      <OtpInput />

      <Countdown disabled={!to} onClick={sendCaptcha}>
        GET CAPTCHA
      </Countdown>
    </Form.Item>
  );
};

export default CaptchaField;
