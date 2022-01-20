import { Bytes } from "@graphprotocol/graph-ts";

import { RoleGranted } from "../generated/ETSAccessControls/ETSAccessControls";
import { safeLoadPublisher } from "../utils/helpers";

// const ADMIN_ROLE = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000000");
const PUBLISHER_ROLE = Bytes.fromHexString("0xad312f08b8889cfe65ec2f1faae419f8b47f0153a3483ea6130918c055c8183d");

/*
 * Track roles that are granted to Ethereum accounts
 *
 * event.params.role - Role being granted (A SHA3 hash of the role name)
 * event.params.account - Account that's been given the role
 * event.params.sender - Account that issued the role
 *
 */
export function handleRoleGranted(event: RoleGranted): void {
  if (event.params.role.equals(PUBLISHER_ROLE)) {
    let entity = safeLoadPublisher(event.params.account.toHexString());

    if (entity) {
      entity.save();
    }
  }
}
