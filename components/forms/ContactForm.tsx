"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { contactSchema, type ContactFormData } from "@/lib/schemas/contact";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-gray-900"
        >
          {t("form_name")} *
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-900"
        >
          {t("form_email")} *
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Subject field */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-semibold text-gray-900"
        >
          {t("form_subject")} *
        </label>
        <input
          {...register("subject")}
          type="text"
          id="subject"
          className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm"
        />
        {errors.subject && (
          <p className="mt-2 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      {/* Message field */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-gray-900"
        >
          {t("form_message")} *
        </label>
        <textarea
          {...register("message")}
          id="message"
          rows={6}
          className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-sm"
        />
        {errors.message && (
          <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Consent checkbox */}
      <div className="flex items-start gap-3">
        <div className="flex h-6 items-center">
          <input
            {...register("consent")}
            type="checkbox"
            id="consent"
            className="size-4 rounded border-gray-300 text-primary-600 transition-colors focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0"
          />
        </div>
        <div className="text-sm leading-6">
          <label htmlFor="consent" className="text-gray-600">
            {t("form_consent")}{" "}
            <Link href="/privacy" className="font-medium text-primary-600 underline-offset-2 hover:underline">
              (Politique de confidentialité)
            </Link>
          </label>
          {errors.consent && (
            <p className="mt-1 text-sm text-red-600">
              {errors.consent.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit button */}
      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full rounded-full bg-primary-600 px-8 py-6 text-base font-semibold hover:bg-primary-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              <span>Envoi en cours...</span>
            </>
          ) : (
            t("form_submit")
          )}
        </Button>
      </div>

      {/* Success/Error messages */}
      {submitStatus === "success" && (
        <div className="flex items-start gap-3 rounded-2xl bg-green-50 p-4 ring-1 ring-green-100">
          <CheckCircle className="size-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium text-green-800">{t("success_message")}</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
          <AlertCircle className="size-5 shrink-0 text-red-600" />
          <p className="text-sm font-medium text-red-800">{t("error_message")}</p>
        </div>
      )}
    </form>
  );
}
