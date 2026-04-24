import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type TreasuryBalanceRequest = {
    $$type: 'TreasuryBalanceRequest';
    queryId: bigint;
    mintAmount: bigint;
    receiver: Address;
}

export function storeTreasuryBalanceRequest(src: TreasuryBalanceRequest) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1127502537, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeInt(src.mintAmount, 257);
        b_0.storeAddress(src.receiver);
    };
}

export function loadTreasuryBalanceRequest(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1127502537) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadIntBig(257);
    const _mintAmount = sc_0.loadIntBig(257);
    const _receiver = sc_0.loadAddress();
    return { $$type: 'TreasuryBalanceRequest' as const, queryId: _queryId, mintAmount: _mintAmount, receiver: _receiver };
}

export function loadTupleTreasuryBalanceRequest(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _mintAmount = source.readBigNumber();
    const _receiver = source.readAddress();
    return { $$type: 'TreasuryBalanceRequest' as const, queryId: _queryId, mintAmount: _mintAmount, receiver: _receiver };
}

export function loadGetterTupleTreasuryBalanceRequest(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _mintAmount = source.readBigNumber();
    const _receiver = source.readAddress();
    return { $$type: 'TreasuryBalanceRequest' as const, queryId: _queryId, mintAmount: _mintAmount, receiver: _receiver };
}

export function storeTupleTreasuryBalanceRequest(source: TreasuryBalanceRequest) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.mintAmount);
    builder.writeAddress(source.receiver);
    return builder.build();
}

export function dictValueParserTreasuryBalanceRequest(): DictionaryValue<TreasuryBalanceRequest> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTreasuryBalanceRequest(src)).endCell());
        },
        parse: (src) => {
            return loadTreasuryBalanceRequest(src.loadRef().beginParse());
        }
    }
}

export type TreasuryBalanceResponse = {
    $$type: 'TreasuryBalanceResponse';
    queryId: bigint;
    mintAmount: bigint;
    receiver: Address;
    treasuryBalance: bigint;
}

export function storeTreasuryBalanceResponse(src: TreasuryBalanceResponse) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2303665634, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeInt(src.mintAmount, 257);
        b_0.storeAddress(src.receiver);
        const b_1 = new Builder();
        b_1.storeInt(src.treasuryBalance, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTreasuryBalanceResponse(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2303665634) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadIntBig(257);
    const _mintAmount = sc_0.loadIntBig(257);
    const _receiver = sc_0.loadAddress();
    const sc_1 = sc_0.loadRef().beginParse();
    const _treasuryBalance = sc_1.loadIntBig(257);
    return { $$type: 'TreasuryBalanceResponse' as const, queryId: _queryId, mintAmount: _mintAmount, receiver: _receiver, treasuryBalance: _treasuryBalance };
}

export function loadTupleTreasuryBalanceResponse(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _mintAmount = source.readBigNumber();
    const _receiver = source.readAddress();
    const _treasuryBalance = source.readBigNumber();
    return { $$type: 'TreasuryBalanceResponse' as const, queryId: _queryId, mintAmount: _mintAmount, receiver: _receiver, treasuryBalance: _treasuryBalance };
}

export function loadGetterTupleTreasuryBalanceResponse(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _mintAmount = source.readBigNumber();
    const _receiver = source.readAddress();
    const _treasuryBalance = source.readBigNumber();
    return { $$type: 'TreasuryBalanceResponse' as const, queryId: _queryId, mintAmount: _mintAmount, receiver: _receiver, treasuryBalance: _treasuryBalance };
}

export function storeTupleTreasuryBalanceResponse(source: TreasuryBalanceResponse) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.mintAmount);
    builder.writeAddress(source.receiver);
    builder.writeNumber(source.treasuryBalance);
    return builder.build();
}

export function dictValueParserTreasuryBalanceResponse(): DictionaryValue<TreasuryBalanceResponse> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTreasuryBalanceResponse(src)).endCell());
        },
        parse: (src) => {
            return loadTreasuryBalanceResponse(src.loadRef().beginParse());
        }
    }
}

export type SetBotWalletAddress = {
    $$type: 'SetBotWalletAddress';
    botWalletAddress: Address;
}

export function storeSetBotWalletAddress(src: SetBotWalletAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1153750340, 32);
        b_0.storeAddress(src.botWalletAddress);
    };
}

export function loadSetBotWalletAddress(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1153750340) { throw Error('Invalid prefix'); }
    const _botWalletAddress = sc_0.loadAddress();
    return { $$type: 'SetBotWalletAddress' as const, botWalletAddress: _botWalletAddress };
}

export function loadTupleSetBotWalletAddress(source: TupleReader) {
    const _botWalletAddress = source.readAddress();
    return { $$type: 'SetBotWalletAddress' as const, botWalletAddress: _botWalletAddress };
}

export function loadGetterTupleSetBotWalletAddress(source: TupleReader) {
    const _botWalletAddress = source.readAddress();
    return { $$type: 'SetBotWalletAddress' as const, botWalletAddress: _botWalletAddress };
}

export function storeTupleSetBotWalletAddress(source: SetBotWalletAddress) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.botWalletAddress);
    return builder.build();
}

export function dictValueParserSetBotWalletAddress(): DictionaryValue<SetBotWalletAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetBotWalletAddress(src)).endCell());
        },
        parse: (src) => {
            return loadSetBotWalletAddress(src.loadRef().beginParse());
        }
    }
}

export type BotWithdraw = {
    $$type: 'BotWithdraw';
    amount: bigint;
    destination: Address;
}

export function storeBotWithdraw(src: BotWithdraw) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(4213753329, 32);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.destination);
    };
}

export function loadBotWithdraw(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 4213753329) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadIntBig(257);
    const _destination = sc_0.loadAddress();
    return { $$type: 'BotWithdraw' as const, amount: _amount, destination: _destination };
}

export function loadTupleBotWithdraw(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    return { $$type: 'BotWithdraw' as const, amount: _amount, destination: _destination };
}

export function loadGetterTupleBotWithdraw(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    return { $$type: 'BotWithdraw' as const, amount: _amount, destination: _destination };
}

export function storeTupleBotWithdraw(source: BotWithdraw) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    return builder.build();
}

export function dictValueParserBotWithdraw(): DictionaryValue<BotWithdraw> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBotWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadBotWithdraw(src.loadRef().beginParse());
        }
    }
}

export type SetVoraTokenAddress = {
    $$type: 'SetVoraTokenAddress';
    voraTokenAddress: Address;
}

export function storeSetVoraTokenAddress(src: SetVoraTokenAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(4068122196, 32);
        b_0.storeAddress(src.voraTokenAddress);
    };
}

export function loadSetVoraTokenAddress(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 4068122196) { throw Error('Invalid prefix'); }
    const _voraTokenAddress = sc_0.loadAddress();
    return { $$type: 'SetVoraTokenAddress' as const, voraTokenAddress: _voraTokenAddress };
}

export function loadTupleSetVoraTokenAddress(source: TupleReader) {
    const _voraTokenAddress = source.readAddress();
    return { $$type: 'SetVoraTokenAddress' as const, voraTokenAddress: _voraTokenAddress };
}

export function loadGetterTupleSetVoraTokenAddress(source: TupleReader) {
    const _voraTokenAddress = source.readAddress();
    return { $$type: 'SetVoraTokenAddress' as const, voraTokenAddress: _voraTokenAddress };
}

export function storeTupleSetVoraTokenAddress(source: SetVoraTokenAddress) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.voraTokenAddress);
    return builder.build();
}

export function dictValueParserSetVoraTokenAddress(): DictionaryValue<SetVoraTokenAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetVoraTokenAddress(src)).endCell());
        },
        parse: (src) => {
            return loadSetVoraTokenAddress(src.loadRef().beginParse());
        }
    }
}

export type Treasury$Data = {
    $$type: 'Treasury$Data';
    owner: Address;
    voraTokenAddress: Address | null;
    botWalletAddress: Address | null;
}

export function storeTreasury$Data(src: Treasury$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.voraTokenAddress);
        b_0.storeAddress(src.botWalletAddress);
    };
}

export function loadTreasury$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _voraTokenAddress = sc_0.loadMaybeAddress();
    const _botWalletAddress = sc_0.loadMaybeAddress();
    return { $$type: 'Treasury$Data' as const, owner: _owner, voraTokenAddress: _voraTokenAddress, botWalletAddress: _botWalletAddress };
}

export function loadTupleTreasury$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _voraTokenAddress = source.readAddressOpt();
    const _botWalletAddress = source.readAddressOpt();
    return { $$type: 'Treasury$Data' as const, owner: _owner, voraTokenAddress: _voraTokenAddress, botWalletAddress: _botWalletAddress };
}

export function loadGetterTupleTreasury$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _voraTokenAddress = source.readAddressOpt();
    const _botWalletAddress = source.readAddressOpt();
    return { $$type: 'Treasury$Data' as const, owner: _owner, voraTokenAddress: _voraTokenAddress, botWalletAddress: _botWalletAddress };
}

export function storeTupleTreasury$Data(source: Treasury$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.voraTokenAddress);
    builder.writeAddress(source.botWalletAddress);
    return builder.build();
}

export function dictValueParserTreasury$Data(): DictionaryValue<Treasury$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTreasury$Data(src)).endCell());
        },
        parse: (src) => {
            return loadTreasury$Data(src.loadRef().beginParse());
        }
    }
}

export type JettonTransfer = {
    $$type: 'JettonTransfer';
    queryId: bigint;
    amount: bigint;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell | null;
    forwardTonAmount: bigint;
    forwardPayload: Slice;
}

export function storeJettonTransfer(src: JettonTransfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forwardTonAmount);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadJettonTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _destination = sc_0.loadAddress();
    const _responseDestination = sc_0.loadAddress();
    const _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _forwardTonAmount = sc_0.loadCoins();
    const _forwardPayload = sc_0;
    return { $$type: 'JettonTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function loadTupleJettonTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    const _responseDestination = source.readAddress();
    const _customPayload = source.readCellOpt();
    const _forwardTonAmount = source.readBigNumber();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'JettonTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function loadGetterTupleJettonTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    const _responseDestination = source.readAddress();
    const _customPayload = source.readCellOpt();
    const _forwardTonAmount = source.readBigNumber();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'JettonTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function storeTupleJettonTransfer(source: JettonTransfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    builder.writeNumber(source.forwardTonAmount);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

export function dictValueParserJettonTransfer(): DictionaryValue<JettonTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransfer(src.loadRef().beginParse());
        }
    }
}

export type CreateTrade = {
    $$type: 'CreateTrade';
    buyer: Address;
    seller: Address;
    tonAmount: bigint;
    voraAmount: bigint;
    feePercentage: bigint;
    reBatePercentage: bigint;
    timeoutLength: bigint;
}

export function storeCreateTrade(src: CreateTrade) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2495137400, 32);
        b_0.storeAddress(src.buyer);
        b_0.storeAddress(src.seller);
        b_0.storeInt(src.tonAmount, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.voraAmount, 257);
        b_1.storeInt(src.feePercentage, 257);
        b_1.storeInt(src.reBatePercentage, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.timeoutLength, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCreateTrade(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2495137400) { throw Error('Invalid prefix'); }
    const _buyer = sc_0.loadAddress();
    const _seller = sc_0.loadAddress();
    const _tonAmount = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _voraAmount = sc_1.loadIntBig(257);
    const _feePercentage = sc_1.loadIntBig(257);
    const _reBatePercentage = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _timeoutLength = sc_2.loadIntBig(257);
    return { $$type: 'CreateTrade' as const, buyer: _buyer, seller: _seller, tonAmount: _tonAmount, voraAmount: _voraAmount, feePercentage: _feePercentage, reBatePercentage: _reBatePercentage, timeoutLength: _timeoutLength };
}

export function loadTupleCreateTrade(source: TupleReader) {
    const _buyer = source.readAddress();
    const _seller = source.readAddress();
    const _tonAmount = source.readBigNumber();
    const _voraAmount = source.readBigNumber();
    const _feePercentage = source.readBigNumber();
    const _reBatePercentage = source.readBigNumber();
    const _timeoutLength = source.readBigNumber();
    return { $$type: 'CreateTrade' as const, buyer: _buyer, seller: _seller, tonAmount: _tonAmount, voraAmount: _voraAmount, feePercentage: _feePercentage, reBatePercentage: _reBatePercentage, timeoutLength: _timeoutLength };
}

export function loadGetterTupleCreateTrade(source: TupleReader) {
    const _buyer = source.readAddress();
    const _seller = source.readAddress();
    const _tonAmount = source.readBigNumber();
    const _voraAmount = source.readBigNumber();
    const _feePercentage = source.readBigNumber();
    const _reBatePercentage = source.readBigNumber();
    const _timeoutLength = source.readBigNumber();
    return { $$type: 'CreateTrade' as const, buyer: _buyer, seller: _seller, tonAmount: _tonAmount, voraAmount: _voraAmount, feePercentage: _feePercentage, reBatePercentage: _reBatePercentage, timeoutLength: _timeoutLength };
}

export function storeTupleCreateTrade(source: CreateTrade) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.buyer);
    builder.writeAddress(source.seller);
    builder.writeNumber(source.tonAmount);
    builder.writeNumber(source.voraAmount);
    builder.writeNumber(source.feePercentage);
    builder.writeNumber(source.reBatePercentage);
    builder.writeNumber(source.timeoutLength);
    return builder.build();
}

export function dictValueParserCreateTrade(): DictionaryValue<CreateTrade> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCreateTrade(src)).endCell());
        },
        parse: (src) => {
            return loadCreateTrade(src.loadRef().beginParse());
        }
    }
}

export type ReleaseTrade = {
    $$type: 'ReleaseTrade';
    tradeId: bigint;
}

export function storeReleaseTrade(src: ReleaseTrade) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3100649420, 32);
        b_0.storeInt(src.tradeId, 257);
    };
}

export function loadReleaseTrade(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3100649420) { throw Error('Invalid prefix'); }
    const _tradeId = sc_0.loadIntBig(257);
    return { $$type: 'ReleaseTrade' as const, tradeId: _tradeId };
}

export function loadTupleReleaseTrade(source: TupleReader) {
    const _tradeId = source.readBigNumber();
    return { $$type: 'ReleaseTrade' as const, tradeId: _tradeId };
}

export function loadGetterTupleReleaseTrade(source: TupleReader) {
    const _tradeId = source.readBigNumber();
    return { $$type: 'ReleaseTrade' as const, tradeId: _tradeId };
}

export function storeTupleReleaseTrade(source: ReleaseTrade) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.tradeId);
    return builder.build();
}

export function dictValueParserReleaseTrade(): DictionaryValue<ReleaseTrade> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReleaseTrade(src)).endCell());
        },
        parse: (src) => {
            return loadReleaseTrade(src.loadRef().beginParse());
        }
    }
}

export type CancelTrade = {
    $$type: 'CancelTrade';
    tradeId: bigint;
}

export function storeCancelTrade(src: CancelTrade) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3059028097, 32);
        b_0.storeInt(src.tradeId, 257);
    };
}

export function loadCancelTrade(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3059028097) { throw Error('Invalid prefix'); }
    const _tradeId = sc_0.loadIntBig(257);
    return { $$type: 'CancelTrade' as const, tradeId: _tradeId };
}

export function loadTupleCancelTrade(source: TupleReader) {
    const _tradeId = source.readBigNumber();
    return { $$type: 'CancelTrade' as const, tradeId: _tradeId };
}

export function loadGetterTupleCancelTrade(source: TupleReader) {
    const _tradeId = source.readBigNumber();
    return { $$type: 'CancelTrade' as const, tradeId: _tradeId };
}

export function storeTupleCancelTrade(source: CancelTrade) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.tradeId);
    return builder.build();
}

export function dictValueParserCancelTrade(): DictionaryValue<CancelTrade> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCancelTrade(src)).endCell());
        },
        parse: (src) => {
            return loadCancelTrade(src.loadRef().beginParse());
        }
    }
}

export type Escrow$Data = {
    $$type: 'Escrow$Data';
    owner: Address;
    treasuryAddress: Address;
    voraTokenAddress: Address;
    trades: Dictionary<bigint, TradeDetails>;
    tradeCounter: bigint;
}

export function storeEscrow$Data(src: Escrow$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.treasuryAddress);
        b_0.storeAddress(src.voraTokenAddress);
        b_0.storeDict(src.trades, Dictionary.Keys.BigInt(257), dictValueParserTradeDetails());
        b_0.storeUint(src.tradeCounter, 64);
    };
}

export function loadEscrow$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _treasuryAddress = sc_0.loadAddress();
    const _voraTokenAddress = sc_0.loadAddress();
    const _trades = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserTradeDetails(), sc_0);
    const _tradeCounter = sc_0.loadUintBig(64);
    return { $$type: 'Escrow$Data' as const, owner: _owner, treasuryAddress: _treasuryAddress, voraTokenAddress: _voraTokenAddress, trades: _trades, tradeCounter: _tradeCounter };
}

export function loadTupleEscrow$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _treasuryAddress = source.readAddress();
    const _voraTokenAddress = source.readAddress();
    const _trades = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserTradeDetails(), source.readCellOpt());
    const _tradeCounter = source.readBigNumber();
    return { $$type: 'Escrow$Data' as const, owner: _owner, treasuryAddress: _treasuryAddress, voraTokenAddress: _voraTokenAddress, trades: _trades, tradeCounter: _tradeCounter };
}

export function loadGetterTupleEscrow$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _treasuryAddress = source.readAddress();
    const _voraTokenAddress = source.readAddress();
    const _trades = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserTradeDetails(), source.readCellOpt());
    const _tradeCounter = source.readBigNumber();
    return { $$type: 'Escrow$Data' as const, owner: _owner, treasuryAddress: _treasuryAddress, voraTokenAddress: _voraTokenAddress, trades: _trades, tradeCounter: _tradeCounter };
}

export function storeTupleEscrow$Data(source: Escrow$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.treasuryAddress);
    builder.writeAddress(source.voraTokenAddress);
    builder.writeCell(source.trades.size > 0 ? beginCell().storeDictDirect(source.trades, Dictionary.Keys.BigInt(257), dictValueParserTradeDetails()).endCell() : null);
    builder.writeNumber(source.tradeCounter);
    return builder.build();
}

export function dictValueParserEscrow$Data(): DictionaryValue<Escrow$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEscrow$Data(src)).endCell());
        },
        parse: (src) => {
            return loadEscrow$Data(src.loadRef().beginParse());
        }
    }
}

export type TradeDetails = {
    $$type: 'TradeDetails';
    buyer: Address;
    seller: Address;
    tonAmount: bigint;
    voraAmount: bigint;
    feePercentage: bigint;
    reBatePercentage: bigint;
    status: string;
    createdAt: bigint;
    timeoutLength: bigint;
}

export function storeTradeDetails(src: TradeDetails) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.buyer);
        b_0.storeAddress(src.seller);
        b_0.storeInt(src.tonAmount, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.voraAmount, 257);
        b_1.storeInt(src.feePercentage, 257);
        b_1.storeInt(src.reBatePercentage, 257);
        b_1.storeStringRefTail(src.status);
        const b_2 = new Builder();
        b_2.storeInt(src.createdAt, 257);
        b_2.storeInt(src.timeoutLength, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadTradeDetails(slice: Slice) {
    const sc_0 = slice;
    const _buyer = sc_0.loadAddress();
    const _seller = sc_0.loadAddress();
    const _tonAmount = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _voraAmount = sc_1.loadIntBig(257);
    const _feePercentage = sc_1.loadIntBig(257);
    const _reBatePercentage = sc_1.loadIntBig(257);
    const _status = sc_1.loadStringRefTail();
    const sc_2 = sc_1.loadRef().beginParse();
    const _createdAt = sc_2.loadIntBig(257);
    const _timeoutLength = sc_2.loadIntBig(257);
    return { $$type: 'TradeDetails' as const, buyer: _buyer, seller: _seller, tonAmount: _tonAmount, voraAmount: _voraAmount, feePercentage: _feePercentage, reBatePercentage: _reBatePercentage, status: _status, createdAt: _createdAt, timeoutLength: _timeoutLength };
}

export function loadTupleTradeDetails(source: TupleReader) {
    const _buyer = source.readAddress();
    const _seller = source.readAddress();
    const _tonAmount = source.readBigNumber();
    const _voraAmount = source.readBigNumber();
    const _feePercentage = source.readBigNumber();
    const _reBatePercentage = source.readBigNumber();
    const _status = source.readString();
    const _createdAt = source.readBigNumber();
    const _timeoutLength = source.readBigNumber();
    return { $$type: 'TradeDetails' as const, buyer: _buyer, seller: _seller, tonAmount: _tonAmount, voraAmount: _voraAmount, feePercentage: _feePercentage, reBatePercentage: _reBatePercentage, status: _status, createdAt: _createdAt, timeoutLength: _timeoutLength };
}

export function loadGetterTupleTradeDetails(source: TupleReader) {
    const _buyer = source.readAddress();
    const _seller = source.readAddress();
    const _tonAmount = source.readBigNumber();
    const _voraAmount = source.readBigNumber();
    const _feePercentage = source.readBigNumber();
    const _reBatePercentage = source.readBigNumber();
    const _status = source.readString();
    const _createdAt = source.readBigNumber();
    const _timeoutLength = source.readBigNumber();
    return { $$type: 'TradeDetails' as const, buyer: _buyer, seller: _seller, tonAmount: _tonAmount, voraAmount: _voraAmount, feePercentage: _feePercentage, reBatePercentage: _reBatePercentage, status: _status, createdAt: _createdAt, timeoutLength: _timeoutLength };
}

export function storeTupleTradeDetails(source: TradeDetails) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.buyer);
    builder.writeAddress(source.seller);
    builder.writeNumber(source.tonAmount);
    builder.writeNumber(source.voraAmount);
    builder.writeNumber(source.feePercentage);
    builder.writeNumber(source.reBatePercentage);
    builder.writeString(source.status);
    builder.writeNumber(source.createdAt);
    builder.writeNumber(source.timeoutLength);
    return builder.build();
}

export function dictValueParserTradeDetails(): DictionaryValue<TradeDetails> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTradeDetails(src)).endCell());
        },
        parse: (src) => {
            return loadTradeDetails(src.loadRef().beginParse());
        }
    }
}

 type Treasury_init_args = {
    $$type: 'Treasury_init_args';
    owner: Address;
}

function initTreasury_init_args(src: Treasury_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
    };
}

async function Treasury_init(owner: Address) {
    const __code = Cell.fromHex('b5ee9c7241020f01000468000228ff008e88f4a413f4bcf2c80bed5320e303ed43d901030167a67f49fb51343480006386fe9035cb00645b64fe9000788075cb00645b64fe90007890cc1b04e5fe900040745b5b78b6cf1b0c60020008f8276f1003c430eda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e1bfa40d72c01916d93fa4001e201d72c01916d93fa4001e243306c1397fa400101d16d6de204925f04e07023d74920c21fe30001c00001c121b0e30202f901040b0d04ec3103d31f218210f27a9e54ba8e41313302fa40308200e34ef84223c705f2f48156d6036e13f2f402c87f01ca0055205023ce01206e9430cf84809201cee201206e9430cf84809201cee2c9ed54db31e021821044c4d544bae302218210fb28c5f1bae302218210433452c9bae302218210946a98b6ba0506070a007431333301fa40308200e34ef84223c705f2f412c87f01ca0055205023ce01206e9430cf84809201cee201206e9430cf84809201cee2c9ed54db3101e4313302810101d700fa4030820093d9256eb3f2f48200d7c6f84226206ef2d080c705f2f48200d557f8276f1023820afaf080a0bef2f47f5872036d6d50436d4133c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00020902fc313302810101d700810101d700fa4030813866f84226206e925b7092c705e2f2f424206ef2d080708040f8276f1010364540c855308210894f25e25005cb1f13810101cf00810101cf00ce01c8810101cf00cdc95a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c901fb00020809001a58cf8680cf8480f400f400cf81004ec87f01ca0055205023ce01206e9430cf84809201cee201206e9430cf84809201cee2c9ed54db3100c68e5f313302d33f30c8018210aff90f5758cb1fcb3fc913f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca0055205023ce01206e9430cf84809201cee201206e9430cf84809201cee2c9ed54db31e00401e432f8416f24135f038d05591d5b5c0a18dbdb9d195e1d0a0a4b9d985b1d594a608d09d19a5b194818dbdb9d1c9858dd1ccbdd1858dd0bd51c99585cdd5c9e4b9d1858dd0e8d8dce8e4ea0db3c02c87f01ca0055205023ce01206e9430cf84809201cee201206e9430cf84809201cee2c9ed540c0094226e8e108b46e756c6c833fe1430fe1430fe14308e33028e22c821c10098802d01cb0701a301de019a7aa90ca630541220c000e63068a592cb07e4da11c9d002fe1430fe1430fe1430e2015482f0158e394e7cc73a9aeb362957fe037665588aef16f3bd68580c13ab84097cf22abae3025f03f2c0820e00e08200e87ef84222c705f2f4f8427f70810082036d6d50436d4133c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0002c87f01ca0055205023ce01206e9430cf84809201cee201206e9430cf84809201cee2c9ed54a66457ee');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initTreasury_init_args({ $$type: 'Treasury_init_args', owner })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const Treasury_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    14438: { message: "Unauthorized request for Treasury Balance" },
    22230: { message: "Already set" },
    37849: { message: "Bot wallet not set" },
    38237: { message: "Trade is not locked" },
    40083: { message: "Timeout not reached" },
    54615: { message: "Insufficient balance" },
    55238: { message: "Only bot can withdraw" },
    58190: { message: "Only owner can set" },
    59518: { message: "Only owner can withdraw directly" },
} as const

export const Treasury_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Unauthorized request for Treasury Balance": 14438,
    "Already set": 22230,
    "Bot wallet not set": 37849,
    "Trade is not locked": 38237,
    "Timeout not reached": 40083,
    "Insufficient balance": 54615,
    "Only bot can withdraw": 55238,
    "Only owner can set": 58190,
    "Only owner can withdraw directly": 59518,
} as const

const Treasury_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TreasuryBalanceRequest","header":1127502537,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mintAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TreasuryBalanceResponse","header":2303665634,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mintAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}},{"name":"treasuryBalance","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SetBotWalletAddress","header":1153750340,"fields":[{"name":"botWalletAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BotWithdraw","header":4213753329,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SetVoraTokenAddress","header":4068122196,"fields":[{"name":"voraTokenAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Treasury$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"voraTokenAddress","type":{"kind":"simple","type":"address","optional":true}},{"name":"botWalletAddress","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"JettonTransfer","header":260734629,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forwardTonAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"CreateTrade","header":2495137400,"fields":[{"name":"buyer","type":{"kind":"simple","type":"address","optional":false}},{"name":"seller","type":{"kind":"simple","type":"address","optional":false}},{"name":"tonAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"voraAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"feePercentage","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"reBatePercentage","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"timeoutLength","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"ReleaseTrade","header":3100649420,"fields":[{"name":"tradeId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"CancelTrade","header":3059028097,"fields":[{"name":"tradeId","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Escrow$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"treasuryAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"voraTokenAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"trades","type":{"kind":"dict","key":"int","value":"TradeDetails","valueFormat":"ref"}},{"name":"tradeCounter","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"TradeDetails","header":null,"fields":[{"name":"buyer","type":{"kind":"simple","type":"address","optional":false}},{"name":"seller","type":{"kind":"simple","type":"address","optional":false}},{"name":"tonAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"voraAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"feePercentage","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"reBatePercentage","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"status","type":{"kind":"simple","type":"string","optional":false}},{"name":"createdAt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"timeoutLength","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const Treasury_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "TreasuryBalanceRequest": 1127502537,
    "TreasuryBalanceResponse": 2303665634,
    "SetBotWalletAddress": 1153750340,
    "BotWithdraw": 4213753329,
    "SetVoraTokenAddress": 4068122196,
    "JettonTransfer": 260734629,
    "CreateTrade": 2495137400,
    "ReleaseTrade": 3100649420,
    "CancelTrade": 3059028097,
}

const Treasury_getters: ABIGetter[] = [
    {"name":"get_balance","methodId":130343,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const Treasury_getterMapping: { [key: string]: string } = {
    'get_balance': 'getGetBalance',
}

const Treasury_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"SetVoraTokenAddress"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetBotWalletAddress"}},
    {"receiver":"internal","message":{"kind":"typed","type":"BotWithdraw"}},
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"text","text":"withdraw"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TreasuryBalanceRequest"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class Treasury implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = Treasury_errors_backward;
    public static readonly opcodes = Treasury_opcodes;
    
    static async init(owner: Address) {
        return await Treasury_init(owner);
    }
    
    static async fromInit(owner: Address) {
        const __gen_init = await Treasury_init(owner);
        const address = contractAddress(0, __gen_init);
        return new Treasury(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new Treasury(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  Treasury_types,
        getters: Treasury_getters,
        receivers: Treasury_receivers,
        errors: Treasury_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: SetVoraTokenAddress | SetBotWalletAddress | BotWithdraw | null | "withdraw" | TreasuryBalanceRequest | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetVoraTokenAddress') {
            body = beginCell().store(storeSetVoraTokenAddress(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetBotWalletAddress') {
            body = beginCell().store(storeSetBotWalletAddress(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'BotWithdraw') {
            body = beginCell().store(storeBotWithdraw(message)).endCell();
        }
        if (message === null) {
            body = new Cell();
        }
        if (message === "withdraw") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TreasuryBalanceRequest') {
            body = beginCell().store(storeTreasuryBalanceRequest(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetBalance(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_balance', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
}