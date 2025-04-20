package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"backend/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8080"
const defaultHost = "172.20.12.112"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	// Add error recovery middleware
	srv.SetRecoverFunc(func(ctx context.Context, err interface{}) error {
		log.Printf("Recovered from panic: %v", err)
		return nil
	})

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	// Create a new CORS middleware
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // In production, replace with specific origins
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Apply CORS middleware
	handler := corsMiddleware.Handler(srv)
	playgroundHandler := corsMiddleware.Handler(playground.Handler("GraphQL playground", "/query"))

	http.Handle("/", playgroundHandler)
	http.Handle("/query", handler)

	log.Printf("connect to http://%s:%s/ for GraphQL playground", defaultHost, port)
	log.Fatal(http.ListenAndServe(defaultHost+":"+port, nil))
}
