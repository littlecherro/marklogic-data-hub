package com.marklogic.hub.dataservices;

// IMPORTANT: Do not edit. This file is generated.

import com.marklogic.client.io.Format;


import com.marklogic.client.DatabaseClient;
import com.marklogic.client.io.marker.JSONWriteHandle;

import com.marklogic.client.impl.BaseProxy;

/**
 * Provides a set of operations on the database server
 */
public interface ExploreDataService {
    /**
     * Creates a ExploreDataService object for executing operations on the database server.
     *
     * The DatabaseClientFactory class can create the DatabaseClient parameter. A single
     * client object can be used for any number of requests and in multiple threads.
     *
     * @param db	provides a client for communicating with the database server
     * @return	an object for executing database operations
     */
    static ExploreDataService on(DatabaseClient db) {
      return on(db, null);
    }
    /**
     * Creates a ExploreDataService object for executing operations on the database server.
     *
     * The DatabaseClientFactory class can create the DatabaseClient parameter. A single
     * client object can be used for any number of requests and in multiple threads.
     *
     * The service declaration uses a custom implementation of the same service instead
     * of the default implementation of the service by specifying an endpoint directory
     * in the modules database with the implementation. A service.json file with the
     * declaration can be read with FileHandle or a string serialization of the JSON
     * declaration with StringHandle.
     *
     * @param db	provides a client for communicating with the database server
     * @param serviceDeclaration	substitutes a custom implementation of the service
     * @return	an object for executing database operations
     */
    static ExploreDataService on(DatabaseClient db, JSONWriteHandle serviceDeclaration) {
        final class ExploreDataServiceImpl implements ExploreDataService {
            private DatabaseClient dbClient;
            private BaseProxy baseProxy;

            private BaseProxy.DBFunctionRequest req_searchAndTransform;
            private BaseProxy.DBFunctionRequest req_getRecentlyVisitedRecords;
            private BaseProxy.DBFunctionRequest req_saveRecentlyVisitedRecord;
            private BaseProxy.DBFunctionRequest req_getRecord;

            private ExploreDataServiceImpl(DatabaseClient dbClient, JSONWriteHandle servDecl) {
                this.dbClient  = dbClient;
                this.baseProxy = new BaseProxy("/explore-data/data-services/ml-exp-search/", servDecl);

                this.req_searchAndTransform = this.baseProxy.request(
                    "searchAndTransform.sjs", BaseProxy.ParameterValuesKind.SINGLE_NODE);
                this.req_getRecentlyVisitedRecords = this.baseProxy.request(
                    "getRecentlyVisitedRecords.sjs", BaseProxy.ParameterValuesKind.SINGLE_ATOMIC);
                this.req_saveRecentlyVisitedRecord = this.baseProxy.request(
                    "saveRecentlyVisitedRecord.sjs", BaseProxy.ParameterValuesKind.SINGLE_NODE);
                this.req_getRecord = this.baseProxy.request(
                    "getRecord.sjs", BaseProxy.ParameterValuesKind.SINGLE_ATOMIC);
            }

            @Override
            public com.fasterxml.jackson.databind.JsonNode searchAndTransform(com.fasterxml.jackson.databind.JsonNode searchParams) {
                return searchAndTransform(
                    this.req_searchAndTransform.on(this.dbClient), searchParams
                    );
            }
            private com.fasterxml.jackson.databind.JsonNode searchAndTransform(BaseProxy.DBFunctionRequest request, com.fasterxml.jackson.databind.JsonNode searchParams) {
              return BaseProxy.JsonDocumentType.toJsonNode(
                request
                      .withParams(
                          BaseProxy.documentParam("searchParams", false, BaseProxy.JsonDocumentType.fromJsonNode(searchParams))
                          ).responseSingle(false, Format.JSON)
                );
            }

            @Override
            public com.fasterxml.jackson.databind.JsonNode getRecentlyVisitedRecords(String user) {
                return getRecentlyVisitedRecords(
                    this.req_getRecentlyVisitedRecords.on(this.dbClient), user
                    );
            }
            private com.fasterxml.jackson.databind.JsonNode getRecentlyVisitedRecords(BaseProxy.DBFunctionRequest request, String user) {
              return BaseProxy.JsonDocumentType.toJsonNode(
                request
                      .withParams(
                          BaseProxy.atomicParam("user", false, BaseProxy.StringType.fromString(user))
                          ).responseSingle(false, Format.JSON)
                );
            }

            @Override
            public void saveRecentlyVisitedRecord(com.fasterxml.jackson.databind.JsonNode recentlyVisitedRecord) {
                saveRecentlyVisitedRecord(
                    this.req_saveRecentlyVisitedRecord.on(this.dbClient), recentlyVisitedRecord
                    );
            }
            private void saveRecentlyVisitedRecord(BaseProxy.DBFunctionRequest request, com.fasterxml.jackson.databind.JsonNode recentlyVisitedRecord) {
              request
                      .withParams(
                          BaseProxy.documentParam("recentlyVisitedRecord", false, BaseProxy.JsonDocumentType.fromJsonNode(recentlyVisitedRecord))
                          ).responseNone();
            }

            @Override
            public com.fasterxml.jackson.databind.JsonNode getRecord(String recordId) {
                return getRecord(
                    this.req_getRecord.on(this.dbClient), recordId
                    );
            }
            private com.fasterxml.jackson.databind.JsonNode getRecord(BaseProxy.DBFunctionRequest request, String recordId) {
              return BaseProxy.JsonDocumentType.toJsonNode(
                request
                      .withParams(
                          BaseProxy.atomicParam("recordId", false, BaseProxy.StringType.fromString(recordId))
                          ).responseSingle(false, Format.JSON)
                );
            }
        }

        return new ExploreDataServiceImpl(db, serviceDeclaration);
    }

  /**
   * Invokes the searchAndTransform operation on the database server
   *
   * @param searchParams	provides input
   * @return	as output
   */
    com.fasterxml.jackson.databind.JsonNode searchAndTransform(com.fasterxml.jackson.databind.JsonNode searchParams);

  /**
   * Invokes the getRecentlyVisitedRecords operation on the database server
   *
   * @param user	provides input
   * @return	as output
   */
    com.fasterxml.jackson.databind.JsonNode getRecentlyVisitedRecords(String user);

  /**
   * Invokes the saveRecentlyVisitedRecord operation on the database server
   *
   * @param recentlyVisitedRecord	provides input
   * 
   */
    void saveRecentlyVisitedRecord(com.fasterxml.jackson.databind.JsonNode recentlyVisitedRecord);

  /**
   * Invokes the getRecord operation on the database server
   *
   * @param recordId	provides input
   * @return	as output
   */
    com.fasterxml.jackson.databind.JsonNode getRecord(String recordId);

}
