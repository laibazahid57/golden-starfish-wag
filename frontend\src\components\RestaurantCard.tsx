import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Restaurant } from "@/types";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Utensils } from "lucide-react"; // Added Utensils icon

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurant/${restaurant.restaurant_id}`);
  };

  const matchingMenuItemsCount = restaurant.menu_items.length;

  return (
    <Card
      className="cursor-pointer hover:bg-primary/10 transition-all duration-200 ease-in-out flex flex-col justify-between p-5 shadow-md hover:shadow-lg rounded-lg border border-border/50"
      onClick={handleClick}
    >
      <CardHeader className="p-0 mb-3">
        <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
          <Utensils className="h-5 w-5 text-muted-foreground" />
          {restaurant.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex justify-between items-center">
        <p className="text-base text-muted-foreground">
          <span className="font-medium text-primary">{matchingMenuItemsCount}</span> matching item{matchingMenuItemsCount !== 1 ? "s" : ""}
        </p>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform duration-200" />
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;