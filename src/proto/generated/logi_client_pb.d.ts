import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';


export class MapFieldStringEntry extends jspb.Message {
  getKey(): string;
  setKey(value: string): MapFieldStringEntry;

  getValueList(): Array<string>;
  setValueList(value: Array<string>): MapFieldStringEntry;
  clearValueList(): MapFieldStringEntry;
  addValue(value: string, index?: number): MapFieldStringEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MapFieldStringEntry.AsObject;
  static toObject(includeInstance: boolean, msg: MapFieldStringEntry): MapFieldStringEntry.AsObject;
  static serializeBinaryToWriter(message: MapFieldStringEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MapFieldStringEntry;
  static deserializeBinaryFromReader(message: MapFieldStringEntry, reader: jspb.BinaryReader): MapFieldStringEntry;
}

export namespace MapFieldStringEntry {
  export type AsObject = {
    key: string,
    valueList: Array<string>,
  }
}

export class HelloRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HelloRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HelloRequest): HelloRequest.AsObject;
  static serializeBinaryToWriter(message: HelloRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HelloRequest;
  static deserializeBinaryFromReader(message: HelloRequest, reader: jspb.BinaryReader): HelloRequest;
}

export namespace HelloRequest {
  export type AsObject = {
  }
}

export class HelloResponse extends jspb.Message {
  getEnvsToProjectsList(): Array<MapFieldStringEntry>;
  setEnvsToProjectsList(value: Array<MapFieldStringEntry>): HelloResponse;
  clearEnvsToProjectsList(): HelloResponse;
  addEnvsToProjects(value?: MapFieldStringEntry, index?: number): MapFieldStringEntry;

  getDatabasesize(): string;
  setDatabasesize(value: string): HelloResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HelloResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HelloResponse): HelloResponse.AsObject;
  static serializeBinaryToWriter(message: HelloResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HelloResponse;
  static deserializeBinaryFromReader(message: HelloResponse, reader: jspb.BinaryReader): HelloResponse;
}

export namespace HelloResponse {
  export type AsObject = {
    envsToProjectsList: Array<MapFieldStringEntry.AsObject>,
    databasesize: string,
  }
}

export class PingRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PingRequest): PingRequest.AsObject;
  static serializeBinaryToWriter(message: PingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PingRequest;
  static deserializeBinaryFromReader(message: PingRequest, reader: jspb.BinaryReader): PingRequest;
}

export namespace PingRequest {
  export type AsObject = {
  }
}

export class PongReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PongReply.AsObject;
  static toObject(includeInstance: boolean, msg: PongReply): PongReply.AsObject;
  static serializeBinaryToWriter(message: PongReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PongReply;
  static deserializeBinaryFromReader(message: PongReply, reader: jspb.BinaryReader): PongReply;
}

export namespace PongReply {
  export type AsObject = {
  }
}

export class LogScope extends jspb.Message {
  getScopeid(): number;
  setScopeid(value: number): LogScope;

  getOwnerscopeid(): number;
  setOwnerscopeid(value: number): LogScope;

  getRootscopeid(): number;
  setRootscopeid(value: number): LogScope;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): LogScope;
  hasCreatedat(): boolean;
  clearCreatedat(): LogScope;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogScope.AsObject;
  static toObject(includeInstance: boolean, msg: LogScope): LogScope.AsObject;
  static serializeBinaryToWriter(message: LogScope, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogScope;
  static deserializeBinaryFromReader(message: LogScope, reader: jspb.BinaryReader): LogScope;
}

export namespace LogScope {
  export type AsObject = {
    scopeid: number,
    ownerscopeid: number,
    rootscopeid: number,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class LogMessage extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): LogMessage;

  getExceptiontitle(): string;
  setExceptiontitle(value: string): LogMessage;

  getStacktrace(): string;
  setStacktrace(value: string): LogMessage;

  getParametersMap(): jspb.Map<string, string>;
  clearParametersMap(): LogMessage;

  getOwnerscopeid(): number;
  setOwnerscopeid(value: number): LogMessage;

  getLevel(): LogLevel;
  setLevel(value: LogLevel): LogMessage;

  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): LogMessage;
  hasCreatedat(): boolean;
  clearCreatedat(): LogMessage;

  getLogid(): number;
  setLogid(value: number): LogMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogMessage.AsObject;
  static toObject(includeInstance: boolean, msg: LogMessage): LogMessage.AsObject;
  static serializeBinaryToWriter(message: LogMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogMessage;
  static deserializeBinaryFromReader(message: LogMessage, reader: jspb.BinaryReader): LogMessage;
}

export namespace LogMessage {
  export type AsObject = {
    message: string,
    exceptiontitle: string,
    stacktrace: string,
    parametersMap: Array<[string, string]>,
    ownerscopeid: number,
    level: LogLevel,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    logid: number,
  }
}

export class FetchLogRequest extends jspb.Message {
  getFrom(): number;
  setFrom(value: number): FetchLogRequest;

  getQuery(): string;
  setQuery(value: string): FetchLogRequest;

  getFromdate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setFromdate(value?: google_protobuf_timestamp_pb.Timestamp): FetchLogRequest;
  hasFromdate(): boolean;
  clearFromdate(): FetchLogRequest;

  getTodate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTodate(value?: google_protobuf_timestamp_pb.Timestamp): FetchLogRequest;
  hasTodate(): boolean;
  clearTodate(): FetchLogRequest;

  getEnvesList(): Array<string>;
  setEnvesList(value: Array<string>): FetchLogRequest;
  clearEnvesList(): FetchLogRequest;
  addEnves(value: string, index?: number): FetchLogRequest;

  getProjectsList(): Array<string>;
  setProjectsList(value: Array<string>): FetchLogRequest;
  clearProjectsList(): FetchLogRequest;
  addProjects(value: string, index?: number): FetchLogRequest;

  getTake(): number;
  setTake(value: number): FetchLogRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FetchLogRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FetchLogRequest): FetchLogRequest.AsObject;
  static serializeBinaryToWriter(message: FetchLogRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FetchLogRequest;
  static deserializeBinaryFromReader(message: FetchLogRequest, reader: jspb.BinaryReader): FetchLogRequest;
}

export namespace FetchLogRequest {
  export type AsObject = {
    from: number,
    query: string,
    fromdate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    todate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    envesList: Array<string>,
    projectsList: Array<string>,
    take: number,
  }
}

export class FetchLogResponse extends jspb.Message {
  getIssuccess(): boolean;
  setIssuccess(value: boolean): FetchLogResponse;

  getError(): string;
  setError(value: string): FetchLogResponse;

  getScopesList(): Array<LogScope>;
  setScopesList(value: Array<LogScope>): FetchLogResponse;
  clearScopesList(): FetchLogResponse;
  addScopes(value?: LogScope, index?: number): LogScope;

  getLogsList(): Array<LogMessage>;
  setLogsList(value: Array<LogMessage>): FetchLogResponse;
  clearLogsList(): FetchLogResponse;
  addLogs(value?: LogMessage, index?: number): LogMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FetchLogResponse.AsObject;
  static toObject(includeInstance: boolean, msg: FetchLogResponse): FetchLogResponse.AsObject;
  static serializeBinaryToWriter(message: FetchLogResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FetchLogResponse;
  static deserializeBinaryFromReader(message: FetchLogResponse, reader: jspb.BinaryReader): FetchLogResponse;
}

export namespace FetchLogResponse {
  export type AsObject = {
    issuccess: boolean,
    error: string,
    scopesList: Array<LogScope.AsObject>,
    logsList: Array<LogMessage.AsObject>,
  }
}

export enum LogLevel { 
  ERROR = 0,
  WARNING = 1,
  INFORMATION = 2,
  DEBUG = 3,
  VERBOSE = 4,
}
