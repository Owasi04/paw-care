"use client";
import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  Phone,
  PawPrint,
  Stethoscope,
  User,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const fieldBase =
  "block w-full rounded-lg border bg-white dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 " +
  "placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-150 " +
  "focus:outline-none [color-scheme:light] dark:[color-scheme:dark]";

const fieldState = (hasError) =>
  hasError
    ? "border-red-500 dark:border-red-400 ring-1 ring-red-500 dark:ring-red-400"
    : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400";

const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
const errorClass = "mt-1.5 text-sm text-red-600 dark:text-red-400";
const requiredMark = <span className="text-red-500 dark:text-red-400">*</span>;

function SectionHeading({ icon: Icon, children }) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-3">
      <Icon
        className="h-5 w-5 text-blue-600 dark:text-blue-400"
        strokeWidth={2}
      />
      {children}
    </h2>
  );
}

// ─── Loading fallback ──────────────────────────────────────────────────
function FormFallback() {
  return (
    <div className="space-y-8 bg-white dark:bg-gray-900 shadow-lg dark:shadow-none dark:ring-1 dark:ring-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto animate-pulse">
      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
      <div className="space-y-5">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Inner Form Component ──────────────────────────────────────────────
const AppointmentForm = () => {
  const [serviceFromUrl] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("service") || "";
    }
    return "";
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      serviceName: serviceFromUrl,
    },
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    const formData = {
      userMail: user?.email,
      userName: user?.name,
      userPhone: data.userPhone,
      petName: data.petName,
      petType: data.petType,
      petBreed: data.petBreed,
      appointmentTime: data.appointmentTime,
      appointmentDate: data.appointmentDate,
      serviceName: data.serviceName,
    };

    try {
      const result = await fetch(`/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (result?.ok) {
        toast.success("Appointment Successful");
        router.push("/services");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { data: session } = useSession();

  const user = session?.user;

  const todayString = new Date().toLocaleDateString("en-CA");

  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-white dark:bg-gray-900 shadow-lg dark:shadow-none dark:ring-1 dark:ring-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto transition-colors duration-150"
      noValidate
    >
      {/* ─── User Info ─── */}
      <div className="space-y-5">
        <SectionHeading icon={User}>Your Information</SectionHeading>

        {/* Email */}
        <div>
          <label htmlFor="userMail" className={labelClass}>
            Email {requiredMark}
          </label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              id="userMail"
              type="email"
              value={user?.email}
              readOnly
              {...register("userMail", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className={`${fieldBase} ${fieldState(errors.userMail)} pl-9 pr-3 py-2`}
            />
          </div>
          {errors.userMail && (
            <p className={errorClass}>{errors.userMail.message}</p>
          )}
        </div>

        {/* Full Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="userName" className={labelClass}>
              Full Name {requiredMark}
            </label>
            <input
              id="userName"
              type="text"
              value={user?.name}
              readOnly
              {...register("userName", {
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`${fieldBase} ${fieldState(errors.userName)} px-3 py-2 mt-1.5`}
            />
            {errors.userName && (
              <p className={errorClass}>{errors.userName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="userPhone" className={labelClass}>
              Phone Number {requiredMark}
            </label>
            <div className="relative mt-1.5">
              <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                id="userPhone"
                type="tel"
                {...register("userPhone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]{7,15}$/,
                    message: "Please enter a valid phone number",
                  },
                })}
                className={`${fieldBase} ${fieldState(errors.userPhone)} pl-9 pr-3 py-2`}
              />
            </div>
            {errors.userPhone && (
              <p className={errorClass}>{errors.userPhone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Pet Info ─── */}
      <div className="space-y-5">
        <SectionHeading icon={PawPrint}>Pet Information</SectionHeading>

        <div>
          <label htmlFor="petName" className={labelClass}>
            Pet Name {requiredMark}
          </label>
          <input
            id="petName"
            type="text"
            {...register("petName", {
              required: "Pet name is required",
              minLength: {
                value: 1,
                message: "Pet name must be at least 1 character",
              },
            })}
            className={`${fieldBase} ${fieldState(errors.petName)} px-3 py-2 mt-1.5`}
          />
          {errors.petName && (
            <p className={errorClass}>{errors.petName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="petType" className={labelClass}>
              Pet Type {requiredMark}
            </label>
            <select
              id="petType"
              {...register("petType", { required: "Please select a pet type" })}
              className={`${fieldBase} ${fieldState(errors.petType)} px-3 py-2 mt-1.5`}
            >
              <option value="">Select type</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Other">Other</option>
            </select>
            {errors.petType && (
              <p className={errorClass}>{errors.petType.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="petBreed" className={labelClass}>
              Pet Breed{" "}
              <span className="text-gray-400 dark:text-gray-500 text-xs">
                (optional)
              </span>
            </label>
            <input
              id="petBreed"
              type="text"
              {...register("petBreed")}
              className={`${fieldBase} border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 px-3 py-2 mt-1.5`}
            />
          </div>
        </div>
      </div>

      {/* ─── Service & Scheduling ─── */}
      <div className="space-y-5">
        <SectionHeading icon={Stethoscope}>Service & Scheduling</SectionHeading>

        <div>
          <label htmlFor="serviceName" className={labelClass}>
            Service {requiredMark}
          </label>
          <input
            id="serviceName"
            type="text"
            readOnly
            placeholder="e.g. Vaccination, Grooming, Checkup"
            {...register("serviceName", {
              required: "Service name is required",
              minLength: {
                value: 2,
                message: "Service name must be at least 2 characters",
              },
            })}
            className={`${fieldBase} ${fieldState(errors.serviceName)} px-3 py-2 mt-1.5`}
          />
          {errors.serviceName && (
            <p className={errorClass}>{errors.serviceName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="appointmentDate" className={labelClass}>
              Appointment Date {requiredMark}
            </label>
            <input
              id="appointmentDate"
              type="date"
              min={todayString} // 2. Add this line to disable past dates in the UI picker
              {...register("appointmentDate", {
                required: "Appointment date is required",
                validate: (value) => {
                  const selected = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return selected >= today || "Date cannot be in the past";
                },
              })}
              className={`${fieldBase} ${fieldState(errors.appointmentDate)} px-3 py-2 mt-1.5`}
            />
            {errors.appointmentDate && (
              <p className={errorClass}>{errors.appointmentDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="appointmentTime" className={labelClass}>
              Appointment Time {requiredMark}
            </label>
            <input
              id="appointmentTime"
              type="time"
              {...register("appointmentTime", {
                required: "Appointment time is required",
              })}
              className={`${fieldBase} ${fieldState(errors.appointmentTime)} px-3 py-2 mt-1.5`}
            />
            {errors.appointmentTime && (
              <p className={errorClass}>{errors.appointmentTime.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Submit ─── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition-colors duration-150 font-medium disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Booking...
          </>
        ) : (
          "Book Appointment"
        )}
      </button>
    </form>
  );
};

export default function AppointmentPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <AppointmentForm />
    </Suspense>
  );
}
