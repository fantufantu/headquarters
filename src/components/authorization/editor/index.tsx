import { Authorization } from "@/api/authorization.types";
import { isEmpty, useBoolean } from "@aiszlab/relax";
import { Drawer, Form } from "musae";
import { RefObject, useImperativeHandle } from "react";
import ResourceSelect from "../../inputs/resource-select";
import ActionSelect from "../../inputs/action-select";
import { useApolloClient } from "@apollo/client/react";
import { CREATE_AUTHORIZATION } from "@/api/authorization";
import TenantSelect from "@/components/inputs/tenant-select";

interface FieldsValue {
  tenantCode: string;
  resourceCode: string;
  actionCode: string;
}

export interface AuthorizationEditorRef {
  open: (authorization?: Authorization) => void;
}

interface Props {
  ref?: RefObject<AuthorizationEditorRef | null>;
  onSuccess?: () => void;
}

/**
 * 权限点编辑器
 * 支持新增或编辑，取决于打开时是否传入权限点`id`
 */
const AuthorizationEditor = ({ ref, onSuccess }: Props) => {
  const {
    "0": isVisible,
    "1": { turnOn, turnOff },
  } = useBoolean();

  const form = Form.useForm<FieldsValue>();
  const client = useApolloClient();

  useImperativeHandle(ref, () => ({
    open: (authorization) => {
      form.reset();
      form.setFieldsValue({
        tenantCode: authorization?.tenantCode,
        resourceCode: authorization?.resourceCode,
        actionCode: authorization?.actionCode,
      });

      turnOn();
    },
  }));

  const submit = async () => {
    const isValid = await form.validate();
    if (!isValid) return;

    const formValue = form.getFieldsValue();

    const { data: { createAuthorization } = {} } = await client.mutate({
      mutation: CREATE_AUTHORIZATION,
      variables: {
        input: {
          tenantCode: formValue.tenantCode ?? "",
          resourceCode: formValue.resourceCode ?? "",
          actionCode: formValue.actionCode ?? "",
        },
      },
    });

    if (!createAuthorization?.id) {
      return;
    }

    turnOff();
    onSuccess?.();
  };

  return (
    <Drawer open={isVisible} onConfirm={submit} onClose={turnOff}>
      <Form<FieldsValue> form={form}>
        <Form.Item
          name="tenantCode"
          label="租户"
          rules={[
            {
              message: "请选择租户",
              validate: async (fieldValue) => {
                return !isEmpty(fieldValue);
              },
            },
          ]}
        >
          <TenantSelect />
        </Form.Item>

        <Form.Item
          name="resourceCode"
          label="资源"
          rules={[
            {
              message: "请选择资源",
              validate: async (fieldValue) => {
                return !isEmpty(fieldValue);
              },
            },
          ]}
        >
          <ResourceSelect />
        </Form.Item>

        <Form.Item
          name="actionCode"
          label="操作"
          rules={[
            {
              message: "请选择操作",
              validate: async (fieldValue) => {
                return !isEmpty(fieldValue);
              },
            },
          ]}
        >
          <ActionSelect />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AuthorizationEditor;
