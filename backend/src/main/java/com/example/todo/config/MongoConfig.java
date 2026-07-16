package com.example.todo.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.connection.SslSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import java.security.SecureRandom;
import java.security.cert.X509Certificate;

@Configuration
@EnableMongoAuditing
public class MongoConfig {

	@Value("${spring.data.mongodb.uri:mongodb://localhost:27017/todo}")
	private String mongoUri;

	@Value("${MONGODB_ALLOW_INVALID_CERTS:false}")
	private boolean allowInvalidCerts;

	@Bean
	public MongoClient mongoClient() throws Exception {
		ConnectionString connString = new ConnectionString(mongoUri);
		MongoClientSettings.Builder builder = MongoClientSettings.builder()
				.applyConnectionString(connString);

		if (allowInvalidCerts) {
			// Create an SSLContext that trusts all certificates (for temporary testing only)
			TrustManager[] trustAllManagers = new TrustManager[]{new X509TrustManager() {
				public void checkClientTrusted(X509Certificate[] chain, String authType) { }
				public void checkServerTrusted(X509Certificate[] chain, String authType) { }
				public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
			}};

			SSLContext sslContext = SSLContext.getInstance("TLS");
			sslContext.init(null, trustAllManagers, new SecureRandom());

			builder.applyToSslSettings(b -> {
				b.enabled(true);
				b.context(sslContext);
			});
		}

		MongoClientSettings settings = builder.build();
		return MongoClients.create(settings);
	}
}
