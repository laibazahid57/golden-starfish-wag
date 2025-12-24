import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UtensilsCrossed, ChefHat } from "lucide-react"; // Added ChefHat

const RestaurantDetailPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { filteredRestaurants } = useSearch();

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const restaurant = filteredRestaurants.find((r) => r.restaurant_id === restaurantId);

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4 bg-card rounded-lg shadow-lg">
        <UtensilsCrossed className="h-24 w-24 text-primary mb-6 opacity-70" />
        <h2 className="text-3xl font-bold mb-4 text-primary">Restaurant Not Found</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-md">
          The restaurant you are looking for could not be found or does not match your current filters.
        </p>
        <Button onClick={() => navigate("/")} className="mt-4 text-lg px-6 py-3">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Button variant="outline" onClick={() => navigate("/")} className="mb-8 rounded-full px-5 py-2 text-base shadow-sm hover:shadow-md transition-all duration-200">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Restaurants
      </Button>

      <Card className="mb-10 p-6 shadow-lg border border-border/50">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-4xl font-extrabold text-primary flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-accent-foreground" />
            {restaurant.name}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">{restaurant.address}</CardDescription>
        </CardHeader>
      </Card>

      <h2 className="text-3xl font-bold mb-6 text-primary">Menu Items ({restaurant.menu_items.length} matching)</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {restaurant.menu_items.map((item) => (
          <Card key={item.menu_item_id} className="shadow-md hover:shadow-lg transition-all duration-200 border border-border/50">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-xl font-semibold text-primary">{item.name}</CardTitle>
              {item.description && <CardDescription className="text-sm text-muted-foreground mt-1">{item.description}</CardDescription>}
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xl font-bold text-accent-foreground mb-2">{item.calories} Calories</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {item.fat_g !== undefined && <p>Fat: <span className="font-medium text-foreground">{item.fat_g}g</span></p>}
                {item.carbs_g !== undefined && <p>Carbs: <span className="font-medium text-foreground">{item.carbs_g}g</span></p>}
                {item.protein_g !== undefined && <p>Protein: <span className="font-medium text-foreground">{item.protein_g}g</span></p>}
                {item.sugar_g !== undefined && <p>Sugar: <span className="font-medium text-foreground">{item.sugar_g}g</span></p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;