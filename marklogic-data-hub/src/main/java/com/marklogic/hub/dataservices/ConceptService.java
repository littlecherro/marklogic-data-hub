package com.marklogic.hub.dataservices;

import com.marklogic.client.DatabaseClient;
import com.marklogic.client.impl.BaseProxy;
import com.marklogic.client.io.Format;
import com.marklogic.client.io.marker.JSONWriteHandle;

/**
 * Provides a set of operations on the database server
 */
public interface ConceptService {
    /**
     * Creates a ModelsService object for executing operations on the database server.
     *
     * The DatabaseClientFactory class can create the DatabaseClient parameter. A single
     * client object can be used for any number of requests and in multiple threads.
     *
     * @param db	provides a client for communicating with the database server
     * @return	an object for executing database operations
     */
    static ConceptService on(DatabaseClient db) {
      return on(db, null);
    }
    /**
     * Creates a ModelsService object for executing operations on the database server.
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
    static ConceptService on(DatabaseClient db, JSONWriteHandle serviceDeclaration) {
        final class ModelsServiceImpl implements ConceptService {
            private DatabaseClient dbClient;
            private BaseProxy baseProxy;


            private BaseProxy.DBFunctionRequest req_createDraftModel;
            private BaseProxy.DBFunctionRequest req_deleteDraftModel;
            private BaseProxy.DBFunctionRequest req_updateDraftModelInfo;


            private ModelsServiceImpl(DatabaseClient dbClient, JSONWriteHandle servDecl) {
                this.dbClient  = dbClient;
                this.baseProxy = new BaseProxy("/data-hub/5/data-services/models/concept/", servDecl);


                this.req_createDraftModel = this.baseProxy.request(
                    "createDraftConceptModel.sjs", BaseProxy.ParameterValuesKind.SINGLE_NODE);
                this.req_deleteDraftModel = this.baseProxy.request(
                    "deleteDraftConceptModel.sjs", BaseProxy.ParameterValuesKind.SINGLE_ATOMIC);
                this.req_updateDraftModelInfo = this.baseProxy.request(
                    "updateDraftConceptModelInfo.sjs", BaseProxy.ParameterValuesKind.MULTIPLE_MIXED);
            }


            @Override
            public com.fasterxml.jackson.databind.JsonNode createDraftModel(com.fasterxml.jackson.databind.JsonNode input) {
                return createDraftModel(
                    this.req_createDraftModel.on(this.dbClient), input
                    );
            }
            private com.fasterxml.jackson.databind.JsonNode createDraftModel(BaseProxy.DBFunctionRequest request, com.fasterxml.jackson.databind.JsonNode input) {
              return BaseProxy.JsonDocumentType.toJsonNode(
                request
                      .withParams(
                          BaseProxy.documentParam("input", false, BaseProxy.JsonDocumentType.fromJsonNode(input))
                          ).responseSingle(false, Format.JSON)
                );
            }

            @Override
            public void deleteDraftModel(String conceptName) {
                deleteDraftModel(
                    this.req_deleteDraftModel.on(this.dbClient), conceptName
                );
            }
            private void deleteDraftModel(BaseProxy.DBFunctionRequest request, String conceptName) {
                request
                    .withParams(
                        BaseProxy.atomicParam("conceptName", false, BaseProxy.StringType.fromString(conceptName))
                    ).responseNone();
            }

            @Override
            public com.fasterxml.jackson.databind.JsonNode updateDraftModelInfo(String name, com.fasterxml.jackson.databind.JsonNode input) {
                return updateDraftModelInfo(
                    this.req_updateDraftModelInfo.on(this.dbClient), name, input
                );
            }
            private com.fasterxml.jackson.databind.JsonNode updateDraftModelInfo(BaseProxy.DBFunctionRequest request, String name, com.fasterxml.jackson.databind.JsonNode input) {
                return BaseProxy.JsonDocumentType.toJsonNode(
                    request
                        .withParams(
                            BaseProxy.atomicParam("name", false, BaseProxy.StringType.fromString(name)),
                            BaseProxy.documentParam("input", false, BaseProxy.JsonDocumentType.fromJsonNode(input))
                        ).responseSingle(false, Format.JSON)
                );
            }

        }

        return new ModelsServiceImpl(db, serviceDeclaration);
    }


  /**
   * Create a new draft model, resulting in a new concept descriptor.
   *
   * @param input	provides input
   * @return	as output
   */
    com.fasterxml.jackson.databind.JsonNode createDraftModel(com.fasterxml.jackson.databind.JsonNode input);



    /**
     * Mark a draft concept class to be deleted
     *
     * @param conceptName	The name of the concept in the model
     *
     */
    void deleteDraftModel(String conceptName);

    /**
     * Update the description of an existing concept class. Changes are saved to the concept class draft collection.
     *
     * @param name	The name of the model
     * @param input	provides input
     * @return	as output
     */
    com.fasterxml.jackson.databind.JsonNode updateDraftModelInfo(String name, com.fasterxml.jackson.databind.JsonNode input);
}