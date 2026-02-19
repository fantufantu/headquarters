import { CREATE_ROLE, ROLE } from "@/api/role";
import { isEmpty, isUndefined, useBoolean } from "@aiszlab/relax";
import { useApolloClient, useLazyQuery } from "@apollo/client/react";
import { Drawer, Form, Input, Loading } from "musae";
import { RefObject, useImperativeHandle } from "react";

interface FormValue {
  code: string;
  name: string;
}

export interface RoleEditorRef {
  open: (roleCode?: string) => Promise<void>;
}

interface Props {
  ref?: RefObject<RoleEditorRef | null>;
  onSuccess?: () => void;
}

const RoleEditor = ({ ref, onSuccess }: Props) => {
  const [isVisible, { turnOff, turnOn }] = useBoolean();
  const form = Form.useForm<FormValue>();
  const client = useApolloClient();
  const {
    "0": queryRole,
    "1": { loading },
  } = useLazyQuery(ROLE);

  useImperativeHandle(ref, () => ({
    open: async (_roleCode) => {
      form.reset();
      turnOn();

      if (!_roleCode) return;

      const _role = (
        await queryRole({
          variables: {
            code: _roleCode,
          },
        }).catch(() => null)
      )?.data?.role;

      form.setFieldsValue({
        code: _role?.code,
        name: _role?.name,
      });
    },
  }));

  const close = () => {
    turnOff();
  };

  const submit = async () => {
    const isValid = await form.validate();
    if (!isValid) return;

    const values = form.getFieldsValue();
    const { data: { createRole } = {} } = await client.mutate({
      mutation: CREATE_ROLE,
      variables: {
        input: {
          code: values.code ?? "",
          name: values.name ?? "",
        },
      },
    });

    if (!createRole) return;
    turnOff();
    onSuccess?.();
  };

  return (
    <Drawer open={isVisible} onClose={close} onConfirm={submit}>
      <Loading loading={loading || true}>
        <Form form={form}>
          <Form.Item
            label="角色编码"
            name="code"
            rules={[
              {
                validate: async (fieldValue) => !isEmpty(fieldValue),
                message: "请输入角色编码",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="角色名称"
            name="name"
            rules={[
              { validate: async (fieldValue) => !isEmpty(fieldValue), message: "请输入角色名称" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Loading>
    </Drawer>
  );
};

export default RoleEditor;
