package com.marklogic.hub.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.marklogic.client.ext.helper.LoggingObject;
import com.marklogic.client.io.DocumentMetadataHandle;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

/**
 * Base class for any object that helps with writing tests. Should only contain the most generic helper methods.
 */
public abstract class TestObject extends LoggingObject {

    protected ObjectMapper objectMapper = new ObjectMapper();

    private DateTimeFormatter dateTimeFormatter;

    /**
     * @param text expected to be a MarkLogic dateTime value - e.g. 2021-03-12T00:47:29.30019Z
     * @return
     */
    protected LocalDateTime parseDateTime(String text) {
        return LocalDateTime.parse(text, getDateTimeFormatter());
    }

    /**
     * @return a DateTimeFormatter that can be used for parsing MarkLogic dateTime values - e.g. 2021-03-12T00:47:29.30019Z
     */
    protected DateTimeFormatter getDateTimeFormatter() {
        if (dateTimeFormatter == null) {
            dateTimeFormatter = new DateTimeFormatterBuilder()
                .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
                .appendFraction(ChronoField.MICRO_OF_SECOND, 0, 7, true)
                .appendPattern("[XXX][X]")
                .parseLenient()
                .toFormatter();
        }
        return dateTimeFormatter;
    }

    protected void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException ex) {
            logger.warn("Unexpected InterruptedException: " + ex.getMessage());
        }
    }

    protected InputStream readInputStreamFromClasspath(String path) {
        try {
            return new ClassPathResource(path).getInputStream();
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    protected File readFileFromClasspath(String path) {
        try {
            return new ClassPathResource(path).getFile();
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    protected String readStringFromClasspath(String path) {
        try {
            return new String(FileCopyUtils.copyToByteArray(readInputStreamFromClasspath(path)), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    protected ObjectNode readJsonObject(String json) {
        try {
            return (ObjectNode) objectMapper.readTree(json);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    protected ObjectNode readJsonObject(File file) {
        try {
            return (ObjectNode) objectMapper.readTree(file);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    protected ArrayNode readJsonArray(String json) {
        try {
            return (ArrayNode) objectMapper.readTree(json);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    protected DocumentMetadataHandle addDefaultPermissions(DocumentMetadataHandle metadata) {
        return metadata.withPermission("data-hub-common",
            DocumentMetadataHandle.Capability.READ,
            DocumentMetadataHandle.Capability.UPDATE);
    }
}
