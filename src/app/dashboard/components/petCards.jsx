import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function PetCard({ pet }) {
  if (!pet) return null;

  return (
    <Card className="w-full max-w-sm p-4 space-y-4 dark:bg-zinc-900 dark:border-zinc-800">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <Avatar className="h-16 w-16">
          <AvatarImage src={pet.petsPhotoURL} alt={pet.petsName} />
          <AvatarFallback>
            {pet.petsName ? pet.petsName[0].toUpperCase() : "PT"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-bold">{pet.petsName}</h3>
          <p className="text-sm text-muted-foreground">
            {pet.species} | {pet.petsBreed}
          </p>
        </div>
      </div>

      {/* Vaccination Badge */}
      <div>
        {pet.isVaccinated ? (
          <Badge className="bg-emerald-500 text-white">Vaccinated</Badge>
        ) : (
          <Badge variant="destructive">Not Vaccinated</Badge>
        )}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="font-medium">Age:</span> {pet.petsAge} yrs
        </div>
        <div>
          <span className="font-medium">Weight:</span> {pet.petsWeight} kg
        </div>
        <div className="col-span-2">
          <span className="font-medium">Owner:</span>{" "}
          <span className="font-black text-[16px]">
            {pet.ownerName || "Unknown"}
          </span>
        </div>
      </div>

      {/* Notes */}
      <div className="text-xs text-muted-foreground">
        {pet.notes && pet.notes.trim() !== "" ? pet.notes : "No medical notes"}
      </div>

      {/* Actions */}
      <div className="flex flex-col">
        <Button variant="outline" size="sm" className="flex-1 py-2">
          View Records
        </Button>
      </div>
    </Card>
  );
}
