package com.example.ingest;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class IngestServiceApplication {
  public static void main(String[] args) {
    SpringApplication.run(IngestServiceApplication.class, args);
  }

  @GetMapping("/health")
  public String health() {
    return "ingest-service: OK";
  }
}
