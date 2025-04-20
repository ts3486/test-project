package graph

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

import (
	"backend/graph/model"
	"backend/service/ai"
	"context"
)

type Resolver struct {
	aiService *ai.AIService
}

type articleResolver struct{ *Resolver }

func (r *articleResolver) SatiricalSummary(ctx context.Context, obj *model.Article) (*string, error) {
	return obj.SatiricalSummary, nil
}

func (r *articleResolver) SatiricalImageURL(ctx context.Context, obj *model.Article) (*string, error) {
	return obj.SatiricalImageURL, nil
}
