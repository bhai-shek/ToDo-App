package com.example.todo.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MongoConfigTest {

    @Test
    void appendsTlsOptionsWhenInvalidCertsEnabled() {
        String uri = "mongodb+srv://todo:pass@cluster.mongodb.net/todo?retryWrites=true&w=majority";

        String result = MongoConfig.normalizeMongoUri(uri, true);

        assertEquals(
                "mongodb+srv://todo:pass@cluster.mongodb.net/todo?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true",
                result
        );
    }

    @Test
    void leavesUriUntouchedWhenTlsAlreadyConfigured() {
        String uri = "mongodb+srv://todo:pass@cluster.mongodb.net/todo?retryWrites=true&w=majority&tls=true";

        String result = MongoConfig.normalizeMongoUri(uri, true);

        assertEquals(uri, result);
    }

    @Test
    void leavesUriUntouchedWhenInvalidCertsDisabled() {
        String uri = "mongodb+srv://todo:pass@cluster.mongodb.net/todo?retryWrites=true&w=majority";

        String result = MongoConfig.normalizeMongoUri(uri, false);

        assertEquals(uri, result);
    }
}
