export enum StorageToken {
  Authentication = 'authentication'
}

export enum AuthenticationToken {
  Authenticated = `${StorageToken.Authentication}/authenticated`,
  WhoAmI = `${StorageToken.Authentication}/whoAmI`
}
