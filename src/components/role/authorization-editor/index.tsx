import { PAGINATE_AUTHORIZATIONS } from "@/api/authorization.api";
import { ASSIGN_AUTHORIZATIONS, ROLE, ROLE_AUTHORIZATIONS } from "@/api/role.api";
import { useBoolean } from "@aiszlab/relax";
import { useApolloClient, useLazyQuery } from "@apollo/client/react";
import { SideSheet, Form, Loading, Transfer } from "musae";
import { RefObject, useImperativeHandle, useMemo, useState } from "react";

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
  const [roleCode, setRoleCode] = useState<string>();
  const [isVisible, { turnOn, turnOff }] = useBoolean();
  const form = Form.useForm<FormValue>();
  const client = useApolloClient();

  const {
    "0": paginateAuthorizations,
    "1": {
      data: { paginateAuthorizations: { items = [] } = {} } = {},
      loading: isPaginatingAuthorizations,
    } = {},
  } = useLazyQuery(PAGINATE_AUTHORIZATIONS);

  const {
    "0": queryRoleAuthorizations,
    "1": { loading: isQueryingRole },
  } = useLazyQuery(ROLE_AUTHORIZATIONS);

  const loading = isPaginatingAuthorizations || isQueryingRole;

  const close = () => {
    turnOff();
  };

  const submit = async () => {
    if (!roleCode) return;

    const isValid = await form.validate();
    if (!isValid) return;

    const fieldsValue = form.getFieldsValue();

    const isSucceed = (
      await client
        .mutate({
          mutation: ASSIGN_AUTHORIZATIONS,
          variables: {
            input: {
              roleCode,
              authorizationIds: fieldsValue.authorizationIds ?? [],
            },
          },
        })
        .catch(() => null)
    )?.data?.assignAuthorizations;

    if (!isSucceed) {
      return;
    }

    turnOff();
  };

  const authorizationOptions = useMemo(() => {
    return items.map(({ id, resourceCode, actionCode }) => ({
      label: `${resourceCode}:${actionCode}`,
      value: id,
    }));
  }, [items]);

  useImperativeHandle(ref, () => {
    return {
      open: async (roleCode) => {
        setRoleCode(roleCode);
        turnOn();

        const [authorizationIds] = await Promise.all([
          queryRoleAuthorizations({ variables: { code: roleCode } }).then(({ data }) =>
            data?.role.authorizations?.map(({ id }) => id),
          ),
          paginateAuthorizations({ variables: { pagination: { limit: 99999, page: 1 } } }),
        ]);

        form.reset();
        form.setFieldsValue({
          authorizationIds,
        });
      },
    };
  });

  return (
    <SideSheet open={isVisible} onClose={close} onConfirm={submit} size={600}>
      <Loading loading={loading}>
        <Form form={form}>
          <Form.Item label="分配权限点" name="authorizationIds">
            <Transfer options={authorizationOptions} />
          </Form.Item>
        </Form>
      </Loading>
    </SideSheet>
  );
};

export default RoleAuthorizationEditor;
