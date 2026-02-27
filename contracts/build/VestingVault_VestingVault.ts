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

export type VestingSchedule = {
    $$type: 'VestingSchedule';
    beneficiary: Address;
    totalAmount: bigint;
    releasedAmount: bigint;
    cliffEnd: bigint;
    linearEnd: bigint;
    unlockMultiplier: bigint;
}

export function storeVestingSchedule(src: VestingSchedule) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.beneficiary);
        b_0.storeInt(src.totalAmount, 257);
        b_0.storeInt(src.releasedAmount, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.cliffEnd, 257);
        b_1.storeInt(src.linearEnd, 257);
        b_1.storeInt(src.unlockMultiplier, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadVestingSchedule(slice: Slice) {
    const sc_0 = slice;
    const _beneficiary = sc_0.loadAddress();
    const _totalAmount = sc_0.loadIntBig(257);
    const _releasedAmount = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _cliffEnd = sc_1.loadIntBig(257);
    const _linearEnd = sc_1.loadIntBig(257);
    const _unlockMultiplier = sc_1.loadIntBig(257);
    return { $$type: 'VestingSchedule' as const, beneficiary: _beneficiary, totalAmount: _totalAmount, releasedAmount: _releasedAmount, cliffEnd: _cliffEnd, linearEnd: _linearEnd, unlockMultiplier: _unlockMultiplier };
}

export function loadTupleVestingSchedule(source: TupleReader) {
    const _beneficiary = source.readAddress();
    const _totalAmount = source.readBigNumber();
    const _releasedAmount = source.readBigNumber();
    const _cliffEnd = source.readBigNumber();
    const _linearEnd = source.readBigNumber();
    const _unlockMultiplier = source.readBigNumber();
    return { $$type: 'VestingSchedule' as const, beneficiary: _beneficiary, totalAmount: _totalAmount, releasedAmount: _releasedAmount, cliffEnd: _cliffEnd, linearEnd: _linearEnd, unlockMultiplier: _unlockMultiplier };
}

export function loadGetterTupleVestingSchedule(source: TupleReader) {
    const _beneficiary = source.readAddress();
    const _totalAmount = source.readBigNumber();
    const _releasedAmount = source.readBigNumber();
    const _cliffEnd = source.readBigNumber();
    const _linearEnd = source.readBigNumber();
    const _unlockMultiplier = source.readBigNumber();
    return { $$type: 'VestingSchedule' as const, beneficiary: _beneficiary, totalAmount: _totalAmount, releasedAmount: _releasedAmount, cliffEnd: _cliffEnd, linearEnd: _linearEnd, unlockMultiplier: _unlockMultiplier };
}

export function storeTupleVestingSchedule(source: VestingSchedule) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.beneficiary);
    builder.writeNumber(source.totalAmount);
    builder.writeNumber(source.releasedAmount);
    builder.writeNumber(source.cliffEnd);
    builder.writeNumber(source.linearEnd);
    builder.writeNumber(source.unlockMultiplier);
    return builder.build();
}

export function dictValueParserVestingSchedule(): DictionaryValue<VestingSchedule> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVestingSchedule(src)).endCell());
        },
        parse: (src) => {
            return loadVestingSchedule(src.loadRef().beginParse());
        }
    }
}

export type AddBeneficiary = {
    $$type: 'AddBeneficiary';
    beneficiary: Address;
    amount: bigint;
    cliffDuration: bigint;
    linearDuration: bigint;
}

export function storeAddBeneficiary(src: AddBeneficiary) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2646524585, 32);
        b_0.storeAddress(src.beneficiary);
        b_0.storeInt(src.amount, 257);
        b_0.storeInt(src.cliffDuration, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.linearDuration, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAddBeneficiary(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2646524585) { throw Error('Invalid prefix'); }
    const _beneficiary = sc_0.loadAddress();
    const _amount = sc_0.loadIntBig(257);
    const _cliffDuration = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _linearDuration = sc_1.loadIntBig(257);
    return { $$type: 'AddBeneficiary' as const, beneficiary: _beneficiary, amount: _amount, cliffDuration: _cliffDuration, linearDuration: _linearDuration };
}

export function loadTupleAddBeneficiary(source: TupleReader) {
    const _beneficiary = source.readAddress();
    const _amount = source.readBigNumber();
    const _cliffDuration = source.readBigNumber();
    const _linearDuration = source.readBigNumber();
    return { $$type: 'AddBeneficiary' as const, beneficiary: _beneficiary, amount: _amount, cliffDuration: _cliffDuration, linearDuration: _linearDuration };
}

export function loadGetterTupleAddBeneficiary(source: TupleReader) {
    const _beneficiary = source.readAddress();
    const _amount = source.readBigNumber();
    const _cliffDuration = source.readBigNumber();
    const _linearDuration = source.readBigNumber();
    return { $$type: 'AddBeneficiary' as const, beneficiary: _beneficiary, amount: _amount, cliffDuration: _cliffDuration, linearDuration: _linearDuration };
}

export function storeTupleAddBeneficiary(source: AddBeneficiary) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.beneficiary);
    builder.writeNumber(source.amount);
    builder.writeNumber(source.cliffDuration);
    builder.writeNumber(source.linearDuration);
    return builder.build();
}

export function dictValueParserAddBeneficiary(): DictionaryValue<AddBeneficiary> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddBeneficiary(src)).endCell());
        },
        parse: (src) => {
            return loadAddBeneficiary(src.loadRef().beginParse());
        }
    }
}

export type ReleaseTokens = {
    $$type: 'ReleaseTokens';
    beneficiary: Address;
}

export function storeReleaseTokens(src: ReleaseTokens) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2959791690, 32);
        b_0.storeAddress(src.beneficiary);
    };
}

export function loadReleaseTokens(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2959791690) { throw Error('Invalid prefix'); }
    const _beneficiary = sc_0.loadAddress();
    return { $$type: 'ReleaseTokens' as const, beneficiary: _beneficiary };
}

export function loadTupleReleaseTokens(source: TupleReader) {
    const _beneficiary = source.readAddress();
    return { $$type: 'ReleaseTokens' as const, beneficiary: _beneficiary };
}

export function loadGetterTupleReleaseTokens(source: TupleReader) {
    const _beneficiary = source.readAddress();
    return { $$type: 'ReleaseTokens' as const, beneficiary: _beneficiary };
}

export function storeTupleReleaseTokens(source: ReleaseTokens) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.beneficiary);
    return builder.build();
}

export function dictValueParserReleaseTokens(): DictionaryValue<ReleaseTokens> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReleaseTokens(src)).endCell());
        },
        parse: (src) => {
            return loadReleaseTokens(src.loadRef().beginParse());
        }
    }
}

export type AdjustMultiplier = {
    $$type: 'AdjustMultiplier';
    beneficiary: Address;
    newMultiplier: bigint;
}

export function storeAdjustMultiplier(src: AdjustMultiplier) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3866411903, 32);
        b_0.storeAddress(src.beneficiary);
        b_0.storeInt(src.newMultiplier, 257);
    };
}

export function loadAdjustMultiplier(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3866411903) { throw Error('Invalid prefix'); }
    const _beneficiary = sc_0.loadAddress();
    const _newMultiplier = sc_0.loadIntBig(257);
    return { $$type: 'AdjustMultiplier' as const, beneficiary: _beneficiary, newMultiplier: _newMultiplier };
}

export function loadTupleAdjustMultiplier(source: TupleReader) {
    const _beneficiary = source.readAddress();
    const _newMultiplier = source.readBigNumber();
    return { $$type: 'AdjustMultiplier' as const, beneficiary: _beneficiary, newMultiplier: _newMultiplier };
}

export function loadGetterTupleAdjustMultiplier(source: TupleReader) {
    const _beneficiary = source.readAddress();
    const _newMultiplier = source.readBigNumber();
    return { $$type: 'AdjustMultiplier' as const, beneficiary: _beneficiary, newMultiplier: _newMultiplier };
}

export function storeTupleAdjustMultiplier(source: AdjustMultiplier) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.beneficiary);
    builder.writeNumber(source.newMultiplier);
    return builder.build();
}

export function dictValueParserAdjustMultiplier(): DictionaryValue<AdjustMultiplier> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAdjustMultiplier(src)).endCell());
        },
        parse: (src) => {
            return loadAdjustMultiplier(src.loadRef().beginParse());
        }
    }
}

export type VestingVault$Data = {
    $$type: 'VestingVault$Data';
    owner: Address;
    voraTokenAddress: Address;
    schedules: Dictionary<Address, VestingSchedule>;
}

export function storeVestingVault$Data(src: VestingVault$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.voraTokenAddress);
        b_0.storeDict(src.schedules, Dictionary.Keys.Address(), dictValueParserVestingSchedule());
    };
}

export function loadVestingVault$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _voraTokenAddress = sc_0.loadAddress();
    const _schedules = Dictionary.load(Dictionary.Keys.Address(), dictValueParserVestingSchedule(), sc_0);
    return { $$type: 'VestingVault$Data' as const, owner: _owner, voraTokenAddress: _voraTokenAddress, schedules: _schedules };
}

export function loadTupleVestingVault$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _voraTokenAddress = source.readAddress();
    const _schedules = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserVestingSchedule(), source.readCellOpt());
    return { $$type: 'VestingVault$Data' as const, owner: _owner, voraTokenAddress: _voraTokenAddress, schedules: _schedules };
}

export function loadGetterTupleVestingVault$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _voraTokenAddress = source.readAddress();
    const _schedules = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserVestingSchedule(), source.readCellOpt());
    return { $$type: 'VestingVault$Data' as const, owner: _owner, voraTokenAddress: _voraTokenAddress, schedules: _schedules };
}

export function storeTupleVestingVault$Data(source: VestingVault$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.voraTokenAddress);
    builder.writeCell(source.schedules.size > 0 ? beginCell().storeDictDirect(source.schedules, Dictionary.Keys.Address(), dictValueParserVestingSchedule()).endCell() : null);
    return builder.build();
}

export function dictValueParserVestingVault$Data(): DictionaryValue<VestingVault$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVestingVault$Data(src)).endCell());
        },
        parse: (src) => {
            return loadVestingVault$Data(src.loadRef().beginParse());
        }
    }
}

 type VestingVault_init_args = {
    $$type: 'VestingVault_init_args';
    owner: Address;
    voraTokenAddress: Address;
}

function initVestingVault_init_args(src: VestingVault_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.voraTokenAddress);
    };
}

async function VestingVault_init(owner: Address, voraTokenAddress: Address) {
    const __code = Cell.fromHex('b5ee9c72410209010002eb000114ff00208e8130e1f2c80b0104ca01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019afa40fa40f40455206c1399fa40fa405902d1016de204925f04e002d70d1ff2e0822182109dbec2a9bae302218210b06ad64abae302218210e674c37fbae302018210946a98b6ba0203060801fc31fa40810101d700810101d700d430d0810101d700308200d717f84226c705f2f4813e622781010b2659f40b6fa192306ddf206e92306d8e2ad0fa40810101d700810101d700d401d0810101d700810101d700810101d700301036103510346c166f06e26ef2f4f82381010b705324a05035a05003a025041035018064c80702f231fa40302381010b2259f40b6fa192306ddf206e92306d8e2ad0fa40810101d700810101d700d401d0810101d700810101d700810101d700301036103510346c166f06e2206ef2d0806f268114e225c200f2f4547543547543108d107e106fdb3c24a1814a0e21c200f2f414a010451035507281010b509ac8040500503334f82321b9935f0470e0f82324be9410235f03e0f82321a15044a15023a858a90401a88064a904008e55505056ce13810101cf00810101cf0001c8810101cf0012810101cf0012810101cf00cdc9134550206e953059f45930944133f413e212c87f01ca0055205023cecef400c9ed5401d031fa40810101d70030817506f84224c705f2f42481010b2359f40b6fa192306ddf206e92306d8e2ad0fa40810101d700810101d700d401d0810101d700810101d700810101d700301036103510346c166f06e2206ef2d0806f26308114e224c200f2f481010b06c807008c55505056ce13810101cf00810101cf0001c8810101cf0012810101cf0012810101cf00cdc9103512206e953059f45930944133f413e2c87f01ca0055205023cecef400c9ed54009a8e45d33f30c8018210aff90f5758cb1fcb3fc913f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca0055205023cecef400c9ed54e05f04f2c082aea21a54');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initVestingVault_init_args({ $$type: 'VestingVault_init_args', owner, voraTokenAddress })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const VestingVault_errors = {
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
    5346: { message: "No schedule found" },
    15970: { message: "Beneficiary already exists" },
    18958: { message: "No tokens due" },
    29958: { message: "Only owner/oracle can adjust" },
    55063: { message: "Only owner can add beneficiaries" },
} as const

export const VestingVault_errors_backward = {
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
    "No schedule found": 5346,
    "Beneficiary already exists": 15970,
    "No tokens due": 18958,
    "Only owner/oracle can adjust": 29958,
    "Only owner can add beneficiaries": 55063,
} as const

const VestingVault_types: ABIType[] = [
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
    {"name":"VestingSchedule","header":null,"fields":[{"name":"beneficiary","type":{"kind":"simple","type":"address","optional":false}},{"name":"totalAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"releasedAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"cliffEnd","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"linearEnd","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"unlockMultiplier","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"AddBeneficiary","header":2646524585,"fields":[{"name":"beneficiary","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"cliffDuration","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"linearDuration","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"ReleaseTokens","header":2959791690,"fields":[{"name":"beneficiary","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"AdjustMultiplier","header":3866411903,"fields":[{"name":"beneficiary","type":{"kind":"simple","type":"address","optional":false}},{"name":"newMultiplier","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"VestingVault$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"voraTokenAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"schedules","type":{"kind":"dict","key":"address","value":"VestingSchedule","valueFormat":"ref"}}]},
]

const VestingVault_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "AddBeneficiary": 2646524585,
    "ReleaseTokens": 2959791690,
    "AdjustMultiplier": 3866411903,
}

const VestingVault_getters: ABIGetter[] = [
]

export const VestingVault_getterMapping: { [key: string]: string } = {
}

const VestingVault_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"AddBeneficiary"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ReleaseTokens"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AdjustMultiplier"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class VestingVault implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = VestingVault_errors_backward;
    public static readonly opcodes = VestingVault_opcodes;
    
    static async init(owner: Address, voraTokenAddress: Address) {
        return await VestingVault_init(owner, voraTokenAddress);
    }
    
    static async fromInit(owner: Address, voraTokenAddress: Address) {
        const __gen_init = await VestingVault_init(owner, voraTokenAddress);
        const address = contractAddress(0, __gen_init);
        return new VestingVault(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new VestingVault(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  VestingVault_types,
        getters: VestingVault_getters,
        receivers: VestingVault_receivers,
        errors: VestingVault_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: AddBeneficiary | ReleaseTokens | AdjustMultiplier | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddBeneficiary') {
            body = beginCell().store(storeAddBeneficiary(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ReleaseTokens') {
            body = beginCell().store(storeReleaseTokens(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AdjustMultiplier') {
            body = beginCell().store(storeAdjustMultiplier(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
}