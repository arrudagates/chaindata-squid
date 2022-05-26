import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Token} from "./token.model"
import {SubstrateRpc} from "./_substrateRpc"
import {EvmNetwork} from "./evmNetwork.model"

@Entity_()
export class Chain {
  constructor(props?: Partial<Chain>) {
    Object.assign(this, props)
  }

  /**
   * talisman-defined id for this substrate chain
   */
  @PrimaryColumn_()
  id!: string

  /**
   * is chain this a testnet?
   */
  @Column_("bool", {nullable: false})
  isTestnet!: boolean

  /**
   * index for sorting chains in a user-friendly way
   */
  @Column_("int4", {nullable: true})
  sortIndex!: number | undefined | null

  /**
   * hash of the first block on this chain
   */
  @Column_("text", {nullable: true})
  genesisHash!: string | undefined | null

  /**
   * ss58 prefix for this chain
   */
  @Column_("int4", {nullable: true})
  prefix!: number | undefined | null

  /**
   * talisman-defined name for this chain
   */
  @Column_("text", {nullable: true})
  name!: string | undefined | null

  /**
   * chain-specified name of this chain
   */
  @Column_("text", {nullable: true})
  chainName!: string | undefined | null

  /**
   * implementation name for this chain
   */
  @Column_("text", {nullable: true})
  implName!: string | undefined | null

  /**
   * specification name for this chain
   */
  @Column_("text", {nullable: true})
  specName!: string | undefined | null

  /**
   * specification version for this chain
   */
  @Column_("text", {nullable: true})
  specVersion!: string | undefined | null

  /**
   * native token for this chain
   */
  @Index_()
  @ManyToOne_(() => Token, {nullable: true})
  nativeToken!: Token | undefined | null

  /**
   * if this chain has orml tokens, this is the index of CurrencyId::Token used for identifying them on-chain. this index is needed for fetching orml token balances
   */
  @Column_("int4", {nullable: true})
  tokensCurrencyIdIndex!: number | undefined | null

  /**
   * other tokens on this chain
   */
  @OneToMany_(() => Token, e => e.squidImplementationDetailChain)
  tokens!: Token[]

  /**
   * account format for this chain
   */
  @Column_("text", {nullable: true})
  account!: string | undefined | null

  /**
   * subscan endpoint for this chain
   */
  @Column_("text", {nullable: true})
  subscanUrl!: string | undefined | null

  /**
   * talisman-defined substrate rpcs for this chain
   */
  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => new SubstrateRpc(undefined, marshal.nonNull(val)))}, nullable: false})
  rpcs!: (SubstrateRpc)[]

  /**
   * health status of this chain
   */
  @Column_("bool", {nullable: false})
  isHealthy!: boolean

  /**
   * evm networks on this chain
   */
  @OneToMany_(() => EvmNetwork, e => e.substrateChain)
  evmNetworks!: EvmNetwork[]

  /**
   * parathreads of this chain (if this chain is a relaychain)
   */
  @OneToMany_(() => Chain, e => e.relay)
  parathreads!: Chain[]

  /**
   * paraId of this chain (if this chain is a parachain for another chain)
   */
  @Column_("int4", {nullable: true})
  paraId!: number | undefined | null

  /**
   * relaychain of this chain (if this chain is a parachain for another chain)
   */
  @Index_()
  @ManyToOne_(() => Chain, {nullable: true})
  relay!: Chain | undefined | null
}
