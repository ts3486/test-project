package ai

import (
	"context"
	"fmt"
	"os"

	"github.com/sashabaranov/go-openai"
)

type AIService struct {
	client *openai.Client
}

func NewAIService() (*AIService, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("OPENAI_API_KEY environment variable is not set")
	}

	client := openai.NewClient(apiKey)
	return &AIService{client: client}, nil
}

func (s *AIService) GenerateSatiricalSummary(ctx context.Context, content string) (string, error) {
	prompt := fmt.Sprintf("Write a humorous, satirical summary of this article in 2-3 sentences:\n\n%s", content)

	resp, err := s.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT4,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
		},
	)

	if err != nil {
		return "", fmt.Errorf("error generating satirical summary: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no response from OpenAI")
	}

	return resp.Choices[0].Message.Content, nil
}

func (s *AIService) GenerateSatiricalImage(ctx context.Context, summary string) (string, error) {
	prompt := fmt.Sprintf("Create a satirical, cartoon-style illustration for this article summary: %s", summary)

	resp, err := s.client.CreateImage(
		ctx,
		openai.ImageRequest{
			Prompt:         prompt,
			Size:           openai.CreateImageSize1024x1024,
			ResponseFormat: openai.CreateImageResponseFormatURL,
			N:              1,
		},
	)

	if err != nil {
		return "", fmt.Errorf("error generating satirical image: %w", err)
	}

	if len(resp.Data) == 0 {
		return "", fmt.Errorf("no image URL in response")
	}

	return resp.Data[0].URL, nil
}

func (s *AIService) ProcessArticle(ctx context.Context, content string) (string, string, error) {
	summary, err := s.GenerateSatiricalSummary(ctx, content)
	if err != nil {
		return "", "", fmt.Errorf("error generating summary: %w", err)
	}

	imageURL, err := s.GenerateSatiricalImage(ctx, summary)
	if err != nil {
		return "", "", fmt.Errorf("error generating image: %w", err)
	}

	return summary, imageURL, nil
}
