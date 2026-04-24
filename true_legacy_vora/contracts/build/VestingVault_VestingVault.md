# Tact compilation report
Contract: VestingVault
BoC Size: 759 bytes

## Structures (Structs and Messages)
Total structures: 18

### DataSize
TL-B: `_ cells:int257 bits:int257 refs:int257 = DataSize`
Signature: `DataSize{cells:int257,bits:int257,refs:int257}`

### SignedBundle
TL-B: `_ signature:fixed_bytes64 signedData:remainder<slice> = SignedBundle`
Signature: `SignedBundle{signature:fixed_bytes64,signedData:remainder<slice>}`

### StateInit
TL-B: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

### Context
TL-B: `_ bounceable:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounceable:bool,sender:address,value:int257,raw:^slice}`

### SendParameters
TL-B: `_ mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell value:int257 to:address bounce:bool = SendParameters`
Signature: `SendParameters{mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell,value:int257,to:address,bounce:bool}`

### MessageParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 to:address bounce:bool = MessageParameters`
Signature: `MessageParameters{mode:int257,body:Maybe ^cell,value:int257,to:address,bounce:bool}`

### DeployParameters
TL-B: `_ mode:int257 body:Maybe ^cell value:int257 bounce:bool init:StateInit{code:^cell,data:^cell} = DeployParameters`
Signature: `DeployParameters{mode:int257,body:Maybe ^cell,value:int257,bounce:bool,init:StateInit{code:^cell,data:^cell}}`

### StdAddress
TL-B: `_ workchain:int8 address:uint256 = StdAddress`
Signature: `StdAddress{workchain:int8,address:uint256}`

### VarAddress
TL-B: `_ workchain:int32 address:^slice = VarAddress`
Signature: `VarAddress{workchain:int32,address:^slice}`

### BasechainAddress
TL-B: `_ hash:Maybe int257 = BasechainAddress`
Signature: `BasechainAddress{hash:Maybe int257}`

### Deploy
TL-B: `deploy#946a98b6 queryId:uint64 = Deploy`
Signature: `Deploy{queryId:uint64}`

### DeployOk
TL-B: `deploy_ok#aff90f57 queryId:uint64 = DeployOk`
Signature: `DeployOk{queryId:uint64}`

### FactoryDeploy
TL-B: `factory_deploy#6d0ff13b queryId:uint64 cashback:address = FactoryDeploy`
Signature: `FactoryDeploy{queryId:uint64,cashback:address}`

### VestingSchedule
TL-B: `_ beneficiary:address totalAmount:int257 releasedAmount:int257 cliffEnd:int257 linearEnd:int257 unlockMultiplier:int257 = VestingSchedule`
Signature: `VestingSchedule{beneficiary:address,totalAmount:int257,releasedAmount:int257,cliffEnd:int257,linearEnd:int257,unlockMultiplier:int257}`

### AddBeneficiary
TL-B: `add_beneficiary#9dbec2a9 beneficiary:address amount:int257 cliffDuration:int257 linearDuration:int257 = AddBeneficiary`
Signature: `AddBeneficiary{beneficiary:address,amount:int257,cliffDuration:int257,linearDuration:int257}`

### ReleaseTokens
TL-B: `release_tokens#b06ad64a beneficiary:address = ReleaseTokens`
Signature: `ReleaseTokens{beneficiary:address}`

### AdjustMultiplier
TL-B: `adjust_multiplier#e674c37f beneficiary:address newMultiplier:int257 = AdjustMultiplier`
Signature: `AdjustMultiplier{beneficiary:address,newMultiplier:int257}`

### VestingVault$Data
TL-B: `_ owner:address voraTokenAddress:address schedules:dict<address, ^VestingSchedule{beneficiary:address,totalAmount:int257,releasedAmount:int257,cliffEnd:int257,linearEnd:int257,unlockMultiplier:int257}> = VestingVault`
Signature: `VestingVault{owner:address,voraTokenAddress:address,schedules:dict<address, ^VestingSchedule{beneficiary:address,totalAmount:int257,releasedAmount:int257,cliffEnd:int257,linearEnd:int257,unlockMultiplier:int257}>}`

## Get methods
Total get methods: 0

## Exit codes
* 2: Stack underflow
* 3: Stack overflow
* 4: Integer overflow
* 5: Integer out of expected range
* 6: Invalid opcode
* 7: Type check error
* 8: Cell overflow
* 9: Cell underflow
* 10: Dictionary error
* 11: 'Unknown' error
* 12: Fatal error
* 13: Out of gas error
* 14: Virtualization error
* 32: Action list is invalid
* 33: Action list is too long
* 34: Action is invalid or not supported
* 35: Invalid source address in outbound message
* 36: Invalid destination address in outbound message
* 37: Not enough Toncoin
* 38: Not enough extra currencies
* 39: Outbound message does not fit into a cell after rewriting
* 40: Cannot process a message
* 41: Library reference is null
* 42: Library change action error
* 43: Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree
* 50: Account state size exceeded limits
* 128: Null reference exception
* 129: Invalid serialization prefix
* 130: Invalid incoming message
* 131: Constraints error
* 132: Access denied
* 133: Contract stopped
* 134: Invalid argument
* 135: Code of a contract was not found
* 136: Invalid standard address
* 138: Not a basechain address
* 5346: No schedule found
* 15970: Beneficiary already exists
* 18958: No tokens due
* 29958: Only owner/oracle can adjust
* 55063: Only owner can add beneficiaries

## Trait inheritance diagram

```mermaid
graph TD
VestingVault
VestingVault --> BaseTrait
VestingVault --> Deployable
Deployable --> BaseTrait
```

## Contract dependency diagram

```mermaid
graph TD
VestingVault
```