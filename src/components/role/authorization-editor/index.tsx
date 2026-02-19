import { useBoolean } from "@aiszlab/relax";
import { Drawer, Form, Transfer } from "musae";
import { RefObject, useImperativeHandle } from "react";

export interface RoleAuthorizationEditorRef {
  open: (roleCode: string) => void;
}

interface FormValue {
  authorizationIds: number[];
}

interface Props {
  ref?: RefObject<RoleAuthorizationEditorRef | null>;
}

const RoleAuthorizationEditor = ({ ref }: Props) => {
  const [isVisible, { turnOn, turnOff }] = useBoolean();
  const form = Form.useForm<FormValue>();

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        turnOn();
      },
    };
  });

  return (
    <Drawer open={isVisible}>
      <Form form={form}>
        <Form.Item label="分配权限点" name="authorizationIds">
          <Transfer options={[]} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default RoleAuthorizationEditor;
