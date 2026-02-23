import { PAGINATE_ROLES } from "@/api/role";
import { ASSIGN_ROLES } from "@/api/user";
import { useBoolean } from "@aiszlab/relax";
import { useApolloClient, useLazyQuery } from "@apollo/client/react";
import { Drawer, Form, Loading, Transfer } from "musae";
import { TransferOption } from "musae/types/transfer";
import { RefObject, useImperativeHandle, useMemo, useState } from "react";

export interface UserRoleAssignerRef {
  open: (id: number) => Promise<void>;
}

interface Props {
  ref?: RefObject<UserRoleAssignerRef | null>;
}

interface FormValue {
  roleCodes: string[];
}

const UserRoleAssigner = ({ ref }: Props) => {
  const {
    "0": isVisible,
    "1": { turnOn, turnOff },
  } = useBoolean(false);
  const form = Form.useForm<FormValue>();
  const client = useApolloClient();
  const [userId, setUserId] = useState<number>();

  const {
    "0": queryRoles,
    "1": { data: { paginateRoles: { items: roles } = {} } = {}, loading },
  } = useLazyQuery(PAGINATE_ROLES);

  useImperativeHandle(ref, () => ({
    open: async (id: number) => {
      turnOn();
      setUserId(id);

      await Promise.all([
        queryRoles({
          variables: {
            pagination: {
              page: 1,
              limit: 999,
            },
          },
        }),
      ]);
    },
  }));

  const submit = async () => {
    if (!userId) return;
    const isValid = form.validate();
    if (!isValid) return;

    const { roleCodes = [] } = form.getFieldsValue();
    const isSucceed = (
      await client.mutate({
        mutation: ASSIGN_ROLES,
        variables: {
          input: {
            userId: 0,
            roleCodes,
          },
        },
      })
    ).data?.assignRoles;

    if (!isSucceed) return;
    turnOff();
  };

  const roleOptions = useMemo(() => {
    return (roles ?? []).map<TransferOption>((role) => ({
      label: role.name,
      value: role.code,
    }));
  }, [roles]);

  return (
    <Drawer title="分配角色" open={isVisible} onClose={turnOff} onConfirm={submit} size={600}>
      <Loading loading={loading}>
        <Form form={form}>
          <Form.Item label="角色">
            <Transfer options={roleOptions} />
          </Form.Item>
        </Form>
      </Loading>
    </Drawer>
  );
};

export default UserRoleAssigner;
