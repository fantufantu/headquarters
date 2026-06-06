import { PAGINATE_ROLES } from "@/api/role.api";
import { ASSIGN_ROLES, WHO_ARE_YOU } from "@/api/user.api";
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
    "1": { data: { paginateRoles: { items: roles } = {} } = {}, loading: isQueryingRoles },
  } = useLazyQuery(PAGINATE_ROLES);

  const {
    "0": queryUser,
    "1": { loading: isQueryingUser },
  } = useLazyQuery(WHO_ARE_YOU);

  const isLoading = isQueryingRoles || isQueryingUser;

  useImperativeHandle(ref, () => ({
    open: async (id: number) => {
      turnOn();
      setUserId(id);

      const [roleCodes] = await Promise.all([
        queryUser({
          variables: {
            id,
          },
        }).then(({ data }) => data?.whoAreYou.roleCodes),
        queryRoles({
          variables: {
            pagination: {
              page: 1,
              limit: 999,
            },
          },
        }),
      ]);

      form.reset();
      form.setFieldsValue({
        roleCodes,
      });
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
            userId,
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
      <Loading loading={isLoading}>
        <Form form={form}>
          <Form.Item label="角色" name="roleCodes">
            <Transfer options={roleOptions} />
          </Form.Item>
        </Form>
      </Loading>
    </Drawer>
  );
};

export default UserRoleAssigner;
