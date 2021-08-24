/**
 * @fileoverview gRPC-Web generated client stub for logiClient
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as logi_client_pb from './logi_client_pb';


export class LoggerClientClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoPing = new grpcWeb.AbstractClientBase.MethodInfo(
    logi_client_pb.PongReply,
    (request: logi_client_pb.PingRequest) => {
      return request.serializeBinary();
    },
    logi_client_pb.PongReply.deserializeBinary
  );

  ping(
    request: logi_client_pb.PingRequest,
    metadata: grpcWeb.Metadata | null): Promise<logi_client_pb.PongReply>;

  ping(
    request: logi_client_pb.PingRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: logi_client_pb.PongReply) => void): grpcWeb.ClientReadableStream<logi_client_pb.PongReply>;

  ping(
    request: logi_client_pb.PingRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: logi_client_pb.PongReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/logiClient.LoggerClient/Ping',
        request,
        metadata || {},
        this.methodInfoPing,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/logiClient.LoggerClient/Ping',
    request,
    metadata || {},
    this.methodInfoPing);
  }

  methodInfoHello = new grpcWeb.AbstractClientBase.MethodInfo(
    logi_client_pb.HelloResponse,
    (request: logi_client_pb.HelloRequest) => {
      return request.serializeBinary();
    },
    logi_client_pb.HelloResponse.deserializeBinary
  );

  hello(
    request: logi_client_pb.HelloRequest,
    metadata: grpcWeb.Metadata | null): Promise<logi_client_pb.HelloResponse>;

  hello(
    request: logi_client_pb.HelloRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: logi_client_pb.HelloResponse) => void): grpcWeb.ClientReadableStream<logi_client_pb.HelloResponse>;

  hello(
    request: logi_client_pb.HelloRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: logi_client_pb.HelloResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/logiClient.LoggerClient/Hello',
        request,
        metadata || {},
        this.methodInfoHello,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/logiClient.LoggerClient/Hello',
    request,
    metadata || {},
    this.methodInfoHello);
  }

  methodInfoFetch = new grpcWeb.AbstractClientBase.MethodInfo(
    logi_client_pb.FetchLogResponse,
    (request: logi_client_pb.FetchLogRequest) => {
      return request.serializeBinary();
    },
    logi_client_pb.FetchLogResponse.deserializeBinary
  );

  fetch(
    request: logi_client_pb.FetchLogRequest,
    metadata: grpcWeb.Metadata | null): Promise<logi_client_pb.FetchLogResponse>;

  fetch(
    request: logi_client_pb.FetchLogRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: logi_client_pb.FetchLogResponse) => void): grpcWeb.ClientReadableStream<logi_client_pb.FetchLogResponse>;

  fetch(
    request: logi_client_pb.FetchLogRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: logi_client_pb.FetchLogResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/logiClient.LoggerClient/Fetch',
        request,
        metadata || {},
        this.methodInfoFetch,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/logiClient.LoggerClient/Fetch',
    request,
    metadata || {},
    this.methodInfoFetch);
  }

}

