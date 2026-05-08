package backend.tukproj.banking_system.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class to handle Cross-Origin Resource Sharing (CORS).
 * This allows the React frontend (running on different ports) to communicate with the backend.
 */
@Configuration
public class CorsConfig {

    /**
     * Configures CORS mappings for the entire application.
     * Allows requests from common development ports (3000, 3001, 5173, etc.).
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Allow all endpoints (/**) to be accessed from specified origins
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "http://localhost:3001")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
