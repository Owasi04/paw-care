"use client";
import { Button } from "@base-ui/react";
import { Loader2, Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const Pets = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { register, handleSubmit } = useForm();
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const uploadToCloudinary = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      if (data.secure_url) {
        setCloudinaryUrl(data.secure_url);
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImageFile(file);
    setCloudinaryUrl(null);

    const reader = new FileReader();
    reader.onloadend = () => setProfilePreview(reader.result);
    reader.readAsDataURL(file);

    await uploadToCloudinary(file);
  };
  const removeImage = (e) => {
    e.stopPropagation();
    setProfilePreview(null);
    setProfileImageFile(null);
    setCloudinaryUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddPets = (data) => {
    console.log(data);
    const formData = {
      ownerName: user?.name,
      petsName: data.petName,
      species: data.species,
      petsBreed: data.breed,
      petsAge: data.age,
      petsWeight: data.weight,
      isVaccinated: data.vaccinated,
      notes: data.notes,
      petsPhotoURL: cloudinaryUrl || null,
    };
  };
  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Add a Pet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add basic information about your pet.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleAddPets)} className="space-y-4">
            <div>
              <label
                htmlFor="pet-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="pet-name"
                  name="name"
                  type="text"
                  {...register("petName")}
                  className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="pet-species"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Species
              </label>
              <div className="mt-2">
                <select
                  id="pet-species"
                  name="species"
                  {...register("species")}
                  className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="pet-breed"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Breed
              </label>
              <div className="mt-2">
                <input
                  id="pet-breed"
                  name="breed"
                  type="text"
                  {...register("breed")}
                  className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="pet-age"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Age (years)
                </label>
                <div className="mt-2">
                  <input
                    id="pet-age"
                    name="age"
                    type="number"
                    {...register("age")}
                    className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="pet-weight"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Weight (kg)
                </label>
                <div className="mt-2">
                  <input
                    id="pet-weight"
                    name="weight"
                    type="text"
                    {...register("weight")}
                    className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="pet-vaccinated"
                name="vaccinated"
                type="checkbox"
                {...register("vaccinated")}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="pet-vaccinated"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Vaccinated
              </label>
            </div>

            <div>
              <label
                htmlFor="pet-notes"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Notes
              </label>
              <div className="mt-2">
                <textarea
                  id="pet-notes"
                  name="notes"
                  rows="4"
                  {...register("notes")}
                  className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                ></textarea>
              </div>
            </div>

            <div>
              <label
                htmlFor="pet-photo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Pets Photo
              </label>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image-input"
                />

                {profilePreview ? (
                  /* Preview state */
                  <div className="flex items-center gap-4 px-4 py-3 bg-zinc-100 rounded-2xl border border-transparent">
                    <div className="relative w-12 h-12 shrink-0">
                      {/* Plain <img> for local base64 preview — CldImage only works with Cloudinary public IDs */}
                      <Image
                        width={100}
                        height={100}
                        src={profilePreview}
                        alt="Profile preview"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-400"
                      />
                      {/* Upload spinner overlay */}
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                          <Loader2
                            size={16}
                            className="text-white animate-spin"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {profileImageFile?.name}
                      </p>
                      <p className="text-xs mt-0.5">
                        {uploading ? (
                          <span className="text-purple-500">Uploading…</span>
                        ) : cloudinaryUrl ? (
                          <span className="text-green-500">Uploaded ✓</span>
                        ) : (
                          <span className="text-gray-400">
                            {profileImageFile
                              ? (profileImageFile.size / 1024).toFixed(0) +
                                " KB"
                              : ""}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        disabled={uploading}
                        aria-label="Change profile picture"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-1 text-gray-400 hover:text-red-500 transition"
                        disabled={uploading}
                        aria-label="Remove profile picture"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty / drop-zone state */
                  <label
                    htmlFor="profile-image-input"
                    className="flex items-center gap-4 px-4 py-3 bg-zinc-100 rounded-2xl border border-dashed border-zinc-300 hover:border-purple-400 hover:bg-purple-50 cursor-pointer transition group"
                  >
                    <div className="w-12 h-12 rounded-full bg-zinc-200 group-hover:bg-purple-100 flex items-center justify-center shrink-0 transition">
                      <Upload
                        size={18}
                        className="text-gray-400 group-hover:text-purple-500 transition"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition">
                        Upload a photo
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        PNG, JPG, GIF up to 5 MB
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl transition mt-4 flex items-center justify-center gap-2"
                >
                  {uploading && <Loader2 size={18} className="animate-spin" />}
                  {uploading ? "Uploading image…" : "Create account"}
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Tip: Toggle your OS/browser dark mode to preview the dark theme.
        </div>
      </div>
    </div>
  );
};

export default Pets;
