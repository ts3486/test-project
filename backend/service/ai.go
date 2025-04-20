package ai

import (
	"context"
	"fmt"
	"os"

	openai "github.com/sashabaranov/go-openai"
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

// GenerateSatiricalSummary generates a humorous and satirical version of the article content
func (s *AIService) GenerateSatiricalSummary(ctx context.Context, content string) (string, error) {
	prompt := fmt.Sprintf(`Please provide a humorous and satirical summary of the following news article. 
	Make it witty and entertaining while maintaining the core message. 
	Use exaggeration and irony where appropriate.
	
	Article content:
	%s`, content)

	resp, err := s.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT4,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a witty and satirical news commentator. Your summaries should be humorous while maintaining the essence of the original story.",
				},
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

	return resp.Choices[0].Message.Content, nil
}

// GenerateSatiricalImage generates an image based on the satirical summary
func (s *AIService) GenerateSatiricalImage(ctx context.Context, summary string) (string, error) {
	prompt := fmt.Sprintf(`Create a humorous and satirical illustration for the following news summary. 
	The image should be in a cartoon style, exaggerated and funny, suitable for a satirical news article.
	
	Summary:
	%s`, summary)

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

	return resp.Data[0].URL, nil
}

// ProcessArticle processes an article to generate both satirical summary and image
func (s *AIService) ProcessArticle(ctx context.Context, content string) (summary string, imageURL string, err error) {
	summary, err = s.GenerateSatiricalSummary(ctx, content)
	if err != nil {
		return "", "", fmt.Errorf("error processing article: %w", err)
	}

	imageURL, err = s.GenerateSatiricalImage(ctx, summary)
	if err != nil {
		return summary, "", fmt.Errorf("error generating image: %w", err)
	}

	return summary, imageURL, nil
}
