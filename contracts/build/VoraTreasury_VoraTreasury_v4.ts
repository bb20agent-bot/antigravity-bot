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

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadGetterTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function storeTupleChangeOwner(source: ChangeOwner) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

export function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadTupleChangeOwnerOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadGetterTupleChangeOwnerOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

export function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    query_id: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address | null;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Slice;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _destination = sc_0.loadAddress();
    const _response_destination = sc_0.loadMaybeAddress();
    const _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _forward_ton_amount = sc_0.loadCoins();
    const _forward_payload = sc_0;
    return { $$type: 'TokenTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

export function loadTupleTokenTransfer(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    const _response_destination = source.readAddressOpt();
    const _custom_payload = source.readCellOpt();
    const _forward_ton_amount = source.readBigNumber();
    const _forward_payload = source.readCell().asSlice();
    return { $$type: 'TokenTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

export function loadGetterTupleTokenTransfer(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    const _response_destination = source.readAddressOpt();
    const _custom_payload = source.readCellOpt();
    const _forward_ton_amount = source.readBigNumber();
    const _forward_payload = source.readCell().asSlice();
    return { $$type: 'TokenTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

export function storeTupleTokenTransfer(source: TokenTransfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

export function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type ReferrerInfo = {
    $$type: 'ReferrerInfo';
    l1: Address | null;
    l2: Address | null;
}

export function storeReferrerInfo(src: ReferrerInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.l1);
        b_0.storeAddress(src.l2);
    };
}

export function loadReferrerInfo(slice: Slice) {
    const sc_0 = slice;
    const _l1 = sc_0.loadMaybeAddress();
    const _l2 = sc_0.loadMaybeAddress();
    return { $$type: 'ReferrerInfo' as const, l1: _l1, l2: _l2 };
}

export function loadTupleReferrerInfo(source: TupleReader) {
    const _l1 = source.readAddressOpt();
    const _l2 = source.readAddressOpt();
    return { $$type: 'ReferrerInfo' as const, l1: _l1, l2: _l2 };
}

export function loadGetterTupleReferrerInfo(source: TupleReader) {
    const _l1 = source.readAddressOpt();
    const _l2 = source.readAddressOpt();
    return { $$type: 'ReferrerInfo' as const, l1: _l1, l2: _l2 };
}

export function storeTupleReferrerInfo(source: ReferrerInfo) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.l1);
    builder.writeAddress(source.l2);
    return builder.build();
}

export function dictValueParserReferrerInfo(): DictionaryValue<ReferrerInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReferrerInfo(src)).endCell());
        },
        parse: (src) => {
            return loadReferrerInfo(src.loadRef().beginParse());
        }
    }
}

export type SetReferrer = {
    $$type: 'SetReferrer';
    user: Address;
    referrer: Address;
}

export function storeSetReferrer(src: SetReferrer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2763147121, 32);
        b_0.storeAddress(src.user);
        b_0.storeAddress(src.referrer);
    };
}

export function loadSetReferrer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2763147121) { throw Error('Invalid prefix'); }
    const _user = sc_0.loadAddress();
    const _referrer = sc_0.loadAddress();
    return { $$type: 'SetReferrer' as const, user: _user, referrer: _referrer };
}

export function loadTupleSetReferrer(source: TupleReader) {
    const _user = source.readAddress();
    const _referrer = source.readAddress();
    return { $$type: 'SetReferrer' as const, user: _user, referrer: _referrer };
}

export function loadGetterTupleSetReferrer(source: TupleReader) {
    const _user = source.readAddress();
    const _referrer = source.readAddress();
    return { $$type: 'SetReferrer' as const, user: _user, referrer: _referrer };
}

export function storeTupleSetReferrer(source: SetReferrer) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.user);
    builder.writeAddress(source.referrer);
    return builder.build();
}

export function dictValueParserSetReferrer(): DictionaryValue<SetReferrer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetReferrer(src)).endCell());
        },
        parse: (src) => {
            return loadSetReferrer(src.loadRef().beginParse());
        }
    }
}

export type RecordT2EVolume = {
    $$type: 'RecordT2EVolume';
    user: Address;
    amount: bigint;
}

export function storeRecordT2EVolume(src: RecordT2EVolume) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(510331182, 32);
        b_0.storeAddress(src.user);
        b_0.storeCoins(src.amount);
    };
}

export function loadRecordT2EVolume(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 510331182) { throw Error('Invalid prefix'); }
    const _user = sc_0.loadAddress();
    const _amount = sc_0.loadCoins();
    return { $$type: 'RecordT2EVolume' as const, user: _user, amount: _amount };
}

export function loadTupleRecordT2EVolume(source: TupleReader) {
    const _user = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'RecordT2EVolume' as const, user: _user, amount: _amount };
}

export function loadGetterTupleRecordT2EVolume(source: TupleReader) {
    const _user = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'RecordT2EVolume' as const, user: _user, amount: _amount };
}

export function storeTupleRecordT2EVolume(source: RecordT2EVolume) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.user);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserRecordT2EVolume(): DictionaryValue<RecordT2EVolume> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRecordT2EVolume(src)).endCell());
        },
        parse: (src) => {
            return loadRecordT2EVolume(src.loadRef().beginParse());
        }
    }
}

export type WithdrawIDO = {
    $$type: 'WithdrawIDO';
    strategy: bigint;
    dev: bigint;
    dex: bigint;
}

export function storeWithdrawIDO(src: WithdrawIDO) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1070403341, 32);
        b_0.storeCoins(src.strategy);
        b_0.storeCoins(src.dev);
        b_0.storeCoins(src.dex);
    };
}

export function loadWithdrawIDO(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1070403341) { throw Error('Invalid prefix'); }
    const _strategy = sc_0.loadCoins();
    const _dev = sc_0.loadCoins();
    const _dex = sc_0.loadCoins();
    return { $$type: 'WithdrawIDO' as const, strategy: _strategy, dev: _dev, dex: _dex };
}

export function loadTupleWithdrawIDO(source: TupleReader) {
    const _strategy = source.readBigNumber();
    const _dev = source.readBigNumber();
    const _dex = source.readBigNumber();
    return { $$type: 'WithdrawIDO' as const, strategy: _strategy, dev: _dev, dex: _dex };
}

export function loadGetterTupleWithdrawIDO(source: TupleReader) {
    const _strategy = source.readBigNumber();
    const _dev = source.readBigNumber();
    const _dex = source.readBigNumber();
    return { $$type: 'WithdrawIDO' as const, strategy: _strategy, dev: _dev, dex: _dex };
}

export function storeTupleWithdrawIDO(source: WithdrawIDO) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.strategy);
    builder.writeNumber(source.dev);
    builder.writeNumber(source.dex);
    return builder.build();
}

export function dictValueParserWithdrawIDO(): DictionaryValue<WithdrawIDO> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdrawIDO(src)).endCell());
        },
        parse: (src) => {
            return loadWithdrawIDO(src.loadRef().beginParse());
        }
    }
}

export type WithdrawSubscription = {
    $$type: 'WithdrawSubscription';
    strategy: bigint;
    tech: bigint;
    lp: bigint;
    p2p: bigint;
}

export function storeWithdrawSubscription(src: WithdrawSubscription) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1173465678, 32);
        b_0.storeCoins(src.strategy);
        b_0.storeCoins(src.tech);
        b_0.storeCoins(src.lp);
        b_0.storeCoins(src.p2p);
    };
}

export function loadWithdrawSubscription(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1173465678) { throw Error('Invalid prefix'); }
    const _strategy = sc_0.loadCoins();
    const _tech = sc_0.loadCoins();
    const _lp = sc_0.loadCoins();
    const _p2p = sc_0.loadCoins();
    return { $$type: 'WithdrawSubscription' as const, strategy: _strategy, tech: _tech, lp: _lp, p2p: _p2p };
}

export function loadTupleWithdrawSubscription(source: TupleReader) {
    const _strategy = source.readBigNumber();
    const _tech = source.readBigNumber();
    const _lp = source.readBigNumber();
    const _p2p = source.readBigNumber();
    return { $$type: 'WithdrawSubscription' as const, strategy: _strategy, tech: _tech, lp: _lp, p2p: _p2p };
}

export function loadGetterTupleWithdrawSubscription(source: TupleReader) {
    const _strategy = source.readBigNumber();
    const _tech = source.readBigNumber();
    const _lp = source.readBigNumber();
    const _p2p = source.readBigNumber();
    return { $$type: 'WithdrawSubscription' as const, strategy: _strategy, tech: _tech, lp: _lp, p2p: _p2p };
}

export function storeTupleWithdrawSubscription(source: WithdrawSubscription) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.strategy);
    builder.writeNumber(source.tech);
    builder.writeNumber(source.lp);
    builder.writeNumber(source.p2p);
    return builder.build();
}

export function dictValueParserWithdrawSubscription(): DictionaryValue<WithdrawSubscription> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdrawSubscription(src)).endCell());
        },
        parse: (src) => {
            return loadWithdrawSubscription(src.loadRef().beginParse());
        }
    }
}

export type VoteBurn = {
    $$type: 'VoteBurn';
    amount: bigint;
}

export function storeVoteBurn(src: VoteBurn) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(491364719, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadVoteBurn(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 491364719) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
    return { $$type: 'VoteBurn' as const, amount: _amount };
}

export function loadTupleVoteBurn(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'VoteBurn' as const, amount: _amount };
}

export function loadGetterTupleVoteBurn(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'VoteBurn' as const, amount: _amount };
}

export function storeTupleVoteBurn(source: VoteBurn) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserVoteBurn(): DictionaryValue<VoteBurn> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVoteBurn(src)).endCell());
        },
        parse: (src) => {
            return loadVoteBurn(src.loadRef().beginParse());
        }
    }
}

export type PayoutAdvisor = {
    $$type: 'PayoutAdvisor';
    amount: bigint;
    recipient: Address;
}

export function storePayoutAdvisor(src: PayoutAdvisor) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2966411870, 32);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.recipient);
    };
}

export function loadPayoutAdvisor(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2966411870) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
    const _recipient = sc_0.loadAddress();
    return { $$type: 'PayoutAdvisor' as const, amount: _amount, recipient: _recipient };
}

export function loadTuplePayoutAdvisor(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _recipient = source.readAddress();
    return { $$type: 'PayoutAdvisor' as const, amount: _amount, recipient: _recipient };
}

export function loadGetterTuplePayoutAdvisor(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _recipient = source.readAddress();
    return { $$type: 'PayoutAdvisor' as const, amount: _amount, recipient: _recipient };
}

export function storeTuplePayoutAdvisor(source: PayoutAdvisor) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.recipient);
    return builder.build();
}

export function dictValueParserPayoutAdvisor(): DictionaryValue<PayoutAdvisor> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePayoutAdvisor(src)).endCell());
        },
        parse: (src) => {
            return loadPayoutAdvisor(src.loadRef().beginParse());
        }
    }
}

export type VoraTreasury_v4$Data = {
    $$type: 'VoraTreasury_v4$Data';
    owner: Address;
    vora_jetton_wallet: Address | null;
    referrers: Dictionary<Address, ReferrerInfo>;
    n_volume: Dictionary<Address, bigint>;
    advisor_pool: bigint;
    tier5_users: Dictionary<Address, boolean>;
    tier5_count: bigint;
    strategy_addr: Address;
    dev_addr: Address;
    dex_addr: Address;
    tech_addr: Address;
    p2p_addr: Address;
}

export function storeVoraTreasury_v4$Data(src: VoraTreasury_v4$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.vora_jetton_wallet);
        b_0.storeDict(src.referrers, Dictionary.Keys.Address(), dictValueParserReferrerInfo());
        b_0.storeDict(src.n_volume, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_0.storeCoins(src.advisor_pool);
        const b_1 = new Builder();
        b_1.storeDict(src.tier5_users, Dictionary.Keys.Address(), Dictionary.Values.Bool());
        b_1.storeInt(src.tier5_count, 257);
        b_1.storeAddress(src.strategy_addr);
        b_1.storeAddress(src.dev_addr);
        const b_2 = new Builder();
        b_2.storeAddress(src.dex_addr);
        b_2.storeAddress(src.tech_addr);
        b_2.storeAddress(src.p2p_addr);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadVoraTreasury_v4$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _vora_jetton_wallet = sc_0.loadMaybeAddress();
    const _referrers = Dictionary.load(Dictionary.Keys.Address(), dictValueParserReferrerInfo(), sc_0);
    const _n_volume = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_0);
    const _advisor_pool = sc_0.loadCoins();
    const sc_1 = sc_0.loadRef().beginParse();
    const _tier5_users = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.Bool(), sc_1);
    const _tier5_count = sc_1.loadIntBig(257);
    const _strategy_addr = sc_1.loadAddress();
    const _dev_addr = sc_1.loadAddress();
    const sc_2 = sc_1.loadRef().beginParse();
    const _dex_addr = sc_2.loadAddress();
    const _tech_addr = sc_2.loadAddress();
    const _p2p_addr = sc_2.loadAddress();
    return { $$type: 'VoraTreasury_v4$Data' as const, owner: _owner, vora_jetton_wallet: _vora_jetton_wallet, referrers: _referrers, n_volume: _n_volume, advisor_pool: _advisor_pool, tier5_users: _tier5_users, tier5_count: _tier5_count, strategy_addr: _strategy_addr, dev_addr: _dev_addr, dex_addr: _dex_addr, tech_addr: _tech_addr, p2p_addr: _p2p_addr };
}

export function loadTupleVoraTreasury_v4$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _vora_jetton_wallet = source.readAddressOpt();
    const _referrers = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserReferrerInfo(), source.readCellOpt());
    const _n_volume = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _advisor_pool = source.readBigNumber();
    const _tier5_users = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    const _tier5_count = source.readBigNumber();
    const _strategy_addr = source.readAddress();
    const _dev_addr = source.readAddress();
    const _dex_addr = source.readAddress();
    const _tech_addr = source.readAddress();
    const _p2p_addr = source.readAddress();
    return { $$type: 'VoraTreasury_v4$Data' as const, owner: _owner, vora_jetton_wallet: _vora_jetton_wallet, referrers: _referrers, n_volume: _n_volume, advisor_pool: _advisor_pool, tier5_users: _tier5_users, tier5_count: _tier5_count, strategy_addr: _strategy_addr, dev_addr: _dev_addr, dex_addr: _dex_addr, tech_addr: _tech_addr, p2p_addr: _p2p_addr };
}

export function loadGetterTupleVoraTreasury_v4$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _vora_jetton_wallet = source.readAddressOpt();
    const _referrers = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserReferrerInfo(), source.readCellOpt());
    const _n_volume = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _advisor_pool = source.readBigNumber();
    const _tier5_users = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    const _tier5_count = source.readBigNumber();
    const _strategy_addr = source.readAddress();
    const _dev_addr = source.readAddress();
    const _dex_addr = source.readAddress();
    const _tech_addr = source.readAddress();
    const _p2p_addr = source.readAddress();
    return { $$type: 'VoraTreasury_v4$Data' as const, owner: _owner, vora_jetton_wallet: _vora_jetton_wallet, referrers: _referrers, n_volume: _n_volume, advisor_pool: _advisor_pool, tier5_users: _tier5_users, tier5_count: _tier5_count, strategy_addr: _strategy_addr, dev_addr: _dev_addr, dex_addr: _dex_addr, tech_addr: _tech_addr, p2p_addr: _p2p_addr };
}

export function storeTupleVoraTreasury_v4$Data(source: VoraTreasury_v4$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.vora_jetton_wallet);
    builder.writeCell(source.referrers.size > 0 ? beginCell().storeDictDirect(source.referrers, Dictionary.Keys.Address(), dictValueParserReferrerInfo()).endCell() : null);
    builder.writeCell(source.n_volume.size > 0 ? beginCell().storeDictDirect(source.n_volume, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.advisor_pool);
    builder.writeCell(source.tier5_users.size > 0 ? beginCell().storeDictDirect(source.tier5_users, Dictionary.Keys.Address(), Dictionary.Values.Bool()).endCell() : null);
    builder.writeNumber(source.tier5_count);
    builder.writeAddress(source.strategy_addr);
    builder.writeAddress(source.dev_addr);
    builder.writeAddress(source.dex_addr);
    builder.writeAddress(source.tech_addr);
    builder.writeAddress(source.p2p_addr);
    return builder.build();
}

export function dictValueParserVoraTreasury_v4$Data(): DictionaryValue<VoraTreasury_v4$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVoraTreasury_v4$Data(src)).endCell());
        },
        parse: (src) => {
            return loadVoraTreasury_v4$Data(src.loadRef().beginParse());
        }
    }
}

 type VoraTreasury_v4_init_args = {
    $$type: 'VoraTreasury_v4_init_args';
    owner: Address;
    strategy: Address;
    dev: Address;
    dex: Address;
    tech: Address;
    p2p: Address;
}

function initVoraTreasury_v4_init_args(src: VoraTreasury_v4_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.strategy);
        b_0.storeAddress(src.dev);
        const b_1 = new Builder();
        b_1.storeAddress(src.dex);
        b_1.storeAddress(src.tech);
        b_1.storeAddress(src.p2p);
        b_0.storeRef(b_1.endCell());
    };
}

async function VoraTreasury_v4_init(owner: Address, strategy: Address, dev: Address, dex: Address, tech: Address, p2p: Address) {
    const __code = Cell.fromHex('b5ee9c7241022301000a3c000262ff008e88f4a413f4bcf2c80bed53208e9c30eda2edfb01d072d721d200d200fa4021103450666f04f86102f862e1ed43d90109020378a0020702016a030501e7acad76a268690000c719fd206b9600c8b6c9fd2000f100fa026a00e87a027d007a02408080eb807d207d206a18687d207d207d2018084e084d884d360e4717fd207d207d206a00e87d207d207d2018081b081a881a0368aa823682b6b6a832c11458d15e1762800036a832b82aa0716d9e3660c00400022501ebade3f6a268690000c719fd206b9600c8b6c9fd2000f100fa026a00e87a027d007a02408080eb807d207d206a18687d207d207d2018084e084d884d360e4717fd207d207d206a00e87d207d207d2018081b081a881a0368aa823682b6b6a832c11458d15e1762800036a832b82aa0712a85ed9e3660c00600e8702a81010b238101014133f40a6fa19401d70030925b6de26eb38e1d3081010b2a028101014133f40a6fa19401d70030925b6de2206ef2d0809131e22082282386f26fc10000be923075e02082238d7ea4c68000be923074e02082205af3107a4000be923073e0822009184e72a000be9172e07101e7b851ded44d0d200018e33fa40d72c01916d93fa4001e201f404d401d0f404fa00f404810101d700fa40fa40d430d0fa40fa40fa4030109c109b109a6c1c8e2ffa40fa40fa40d401d0fa40fa40fa403010361035103406d155046d056d6d50658228b1a2bc2ec500006d5065705540e2db3c6cc180800022b02fced44d0d200018e33fa40d72c01916d93fa4001e201f404d401d0f404fa00f404810101d700fa40fa40d430d0fa40fa40fa4030109c109b109a6c1c8e2ffa40fa40fa40d401d0fa40fa40fa403010361035103406d155046d056d6d50658228b1a2bc2ec500006d5065705540e20d925f0de02bd749c21f9139e30d0af9010a2204520bd31f2182101e6b092ebae302218210b0cfda5ebae3022182101d49a16fbae3022182103fcd0f0dba0b10111204f031fa40fa003050cddb3c702981010b2f8101014133f40a6fa19401d70030925b6de26eb38e1d302881010b2e8101014133f40a6fa19401d70030925b6de2206ef2d080de2ea00981010b53ea810101216e955b59f4593098c801cf004133f441e20982282386f26fc10000be9170e30de30081010b544a1e170c0d0e002c2681010b2e714133f40a6fa19401d70030925b6de26e003a0681010b2d7f71216e955b59f4593098c801cf004133f441e205a4050603fc59f40b6fa192306ddf206e92306d8e1bd0d72c01916d93fa4001e201d72c01916d93fa4001e2126c126f02e2206eb38f4720206ef2d0806f22306eb38ea920206ef2d0806f2230206ef2d0802ea70f8064a9048bd543245204c31205265776172648103fdb3c0cde20206ef2d0806f22316eb392303ce30d92303ce255191a0f21017a206ef2d0806f2231206ef2d0800da7058064a9048bd543245204c3220526577617264810ce10bd10ac109b108a107910681057104610351024db3c55911a03b231fa00fa403050cddb3c8200d0c026c209f2f482008ea1538dbef2f4517ca18d07d39bd89b195cdcd94813d89b1a59d94e8810591d9a5cdbdc8814185e5bdd5d2010ce10bd10ac109b1a10791068105710461035414013db3c171a2102fa31fa00308200d77881010bf8422859714133f40a6fa19401d70030925b6de26eb3f2f48d08600000000000000000000000000000000000000000000000000000000000000000048d0691dbdd995c9b985b98d94e8814dd1c985d1959da58c8109d5c9ba010ce10bd10ac109b108a10791068105710461035103412db3c1a21043ce30221821045f1aa4ebae302218210a4b24771bae302018210946a98b6ba13161d2004b831fa00fa00fa003010bc10ac109c108c107c106c105c104c103c4cdedb3c2cc2008eac8bf49444f205374726174202835302529810cd10bc10ab2510ab109a108907081056104510344300db3c55a0913ce22cc200913ce30d2cc200171a141501528bd49444f20446576202832302529810bd10ac109b108a23108a1079106810570610354400db3c55911a01d68ea88bd49444f20444558202833302529810ad109c108b107a10692110691058104710365055db3c5582913ce25528c87f01ca0055b050bcce5009206e9430cf84809201cee217f40005c8f4005004fa0212f400810101cf00ce12ce02c8ce13ce13ce12cdcdc9ed54db311a04b831fa00fa00fa00fa003010bd5e39108c107d106c105d104c103d4cefdb3c2dc2008eac8bf535542205374726174202835302529810cd10bc10ab2510ab109a1089070810561045103443ffdb3c55b0913de22bc200913be30d2cc200171a18190010f8422cc705f2e08401588bd53554220546563682028352529810bd10ac109b108a10791068211068105710461035045033db3c0b55811a03fe8eb38d0414d55088111156081314080a0c8c094a6010ad109c108b107a106921106910581047103605103401db3c4b9a4867454403913ce22cc2008eb78d0554d55088140c9408109c9bdad95c9cc80a0c8d494a60109d108c107b106a105910481037465023103459db3c103b4a891037465504913ce2107b106a105910481a1a1c01f28179572e6eb3f2f42d206ef2d080820afaf08071706d82089896804516104710385614035077c8556082100f8a7ea55008cb1f16cb3f5004fa0212ce01206e9430cf84809201cee2f40001fa02cec9135a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c901fb001b001a58cf8680cf8480f400f400cf8100821037464405c87f01ca0055b050bcce5009206e9430cf84809201cee217f40005c8f4005004fa0212f400810101cf00ce12ce02c8ce13ce13ce12cdcdc9ed54db3102fc31fa40fa40302981010b2359f40b6fa192306ddf206e92306d8e1bd0d72c01916d93fa4001e201d72c01916d93fa4001e2126c126f02e28200e93e016ef2f42981010b2259f40b6fa192306ddf206e92306d8e1bd0d72c01916d93fa4001e201d72c01916d93fa4001e2126c126f02e26d216eb39131e30d0181010b02c81e1f001230206ef2d0806f223000ee5959206e9430cf84809201cee201206e9430cf84809201cee2c9103a12206e953059f45930944133f413e2109b108a091068105710461035443012c87f01ca0055b050bcce5009206e9430cf84809201cee217f40005c8f4005004fa0212f400810101cf00ce12ce02c8ce13ce13ce12cdcdc9ed54db31019a8ec7d33f30c8018210aff90f5758cb1fcb3fc910ac109b108a10791068105710461035443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e039108a210078c87f01ca0055b050bcce5009206e9430cf84809201cee217f40005c8f4005004fa0212f400810101cf00ce12ce02c8ce13ce13ce12cdcdc9ed54db3100dc82f071a1ec67b1d252cdd4096d9115e629e01397e30cc2422b00d08f3b5aba8eb347ba8e43f842109b0a10795516c87f01ca0055b050bcce5009206e9430cf84809201cee217f40005c8f4005004fa0212f400810101cf00ce12ce02c8ce13ce13ce12cdcdc9ed54e05f0bf2c082e2c8f04c');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initVoraTreasury_v4_init_args({ $$type: 'VoraTreasury_v4_init_args', owner, strategy, dev, dex, tech, p2p })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const VoraTreasury_v4_errors = {
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
    31063: { message: "Budget error" },
    36513: { message: "Insufficient advisor pool" },
    53440: { message: "Noblesse Oblige: Minimum 10 Tier-5 Crew needed to unlock" },
    55160: { message: "Only Tier-5 Crew can vote" },
    59710: { message: "Referrer locked" },
} as const

export const VoraTreasury_v4_errors_backward = {
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
    "Budget error": 31063,
    "Insufficient advisor pool": 36513,
    "Noblesse Oblige: Minimum 10 Tier-5 Crew needed to unlock": 53440,
    "Only Tier-5 Crew can vote": 55160,
    "Referrer locked": 59710,
} as const

const VoraTreasury_v4_types: ABIType[] = [
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
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TokenTransfer","header":260734629,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":true}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"ReferrerInfo","header":null,"fields":[{"name":"l1","type":{"kind":"simple","type":"address","optional":true}},{"name":"l2","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"SetReferrer","header":2763147121,"fields":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"referrer","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RecordT2EVolume","header":510331182,"fields":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"WithdrawIDO","header":1070403341,"fields":[{"name":"strategy","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"dev","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"dex","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"WithdrawSubscription","header":1173465678,"fields":[{"name":"strategy","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"tech","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lp","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"p2p","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"VoteBurn","header":491364719,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"PayoutAdvisor","header":2966411870,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"recipient","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"VoraTreasury_v4$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"vora_jetton_wallet","type":{"kind":"simple","type":"address","optional":true}},{"name":"referrers","type":{"kind":"dict","key":"address","value":"ReferrerInfo","valueFormat":"ref"}},{"name":"n_volume","type":{"kind":"dict","key":"address","value":"int"}},{"name":"advisor_pool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"tier5_users","type":{"kind":"dict","key":"address","value":"bool"}},{"name":"tier5_count","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"strategy_addr","type":{"kind":"simple","type":"address","optional":false}},{"name":"dev_addr","type":{"kind":"simple","type":"address","optional":false}},{"name":"dex_addr","type":{"kind":"simple","type":"address","optional":false}},{"name":"tech_addr","type":{"kind":"simple","type":"address","optional":false}},{"name":"p2p_addr","type":{"kind":"simple","type":"address","optional":false}}]},
]

const VoraTreasury_v4_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "ChangeOwner": 2174598809,
    "ChangeOwnerOk": 846932810,
    "TokenTransfer": 260734629,
    "SetReferrer": 2763147121,
    "RecordT2EVolume": 510331182,
    "WithdrawIDO": 1070403341,
    "WithdrawSubscription": 1173465678,
    "VoteBurn": 491364719,
    "PayoutAdvisor": 2966411870,
}

const VoraTreasury_v4_getters: any[] = [
    {"name":"get_dnft_tier","methodId":76743,"arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"get_stats","methodId":74074,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"owner","methodId":83229,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const VoraTreasury_v4_getterMapping: { [key: string]: string } = {
    'get_dnft_tier': 'getGetDnftTier',
    'get_stats': 'getGetStats',
    'owner': 'getOwner',
}

const VoraTreasury_v4_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"text","text":"Set Jetton Wallet"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RecordT2EVolume"}},
    {"receiver":"internal","message":{"kind":"typed","type":"PayoutAdvisor"}},
    {"receiver":"internal","message":{"kind":"typed","type":"VoteBurn"}},
    {"receiver":"internal","message":{"kind":"typed","type":"WithdrawIDO"}},
    {"receiver":"internal","message":{"kind":"typed","type":"WithdrawSubscription"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetReferrer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class VoraTreasury_v4 implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = VoraTreasury_v4_errors_backward;
    public static readonly opcodes = VoraTreasury_v4_opcodes;
    
    static async init(owner: Address, strategy: Address, dev: Address, dex: Address, tech: Address, p2p: Address) {
        return await VoraTreasury_v4_init(owner, strategy, dev, dex, tech, p2p);
    }
    
    static async fromInit(owner: Address, strategy: Address, dev: Address, dex: Address, tech: Address, p2p: Address) {
        const __gen_init = await VoraTreasury_v4_init(owner, strategy, dev, dex, tech, p2p);
        const address = contractAddress(0, __gen_init);
        return new VoraTreasury_v4(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new VoraTreasury_v4(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  VoraTreasury_v4_types,
        getters: VoraTreasury_v4_getters,
        receivers: VoraTreasury_v4_receivers,
        errors: VoraTreasury_v4_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: "Set Jetton Wallet" | RecordT2EVolume | PayoutAdvisor | VoteBurn | WithdrawIDO | WithdrawSubscription | SetReferrer | Deploy) {
        
        let body: Cell | null = null;
        if (message === "Set Jetton Wallet") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RecordT2EVolume') {
            body = beginCell().store(storeRecordT2EVolume(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'PayoutAdvisor') {
            body = beginCell().store(storePayoutAdvisor(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'VoteBurn') {
            body = beginCell().store(storeVoteBurn(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WithdrawIDO') {
            body = beginCell().store(storeWithdrawIDO(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WithdrawSubscription') {
            body = beginCell().store(storeWithdrawSubscription(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetReferrer') {
            body = beginCell().store(storeSetReferrer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetDnftTier(provider: ContractProvider, user: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(user);
        const source = (await provider.get('get_dnft_tier', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetStats(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_stats', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('owner', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
}