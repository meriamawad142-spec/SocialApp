import React, { useContext } from "react";
import { FaTimes, FaLock } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  ChangePasswordSchema,
  type ChangePasswordSchemaType,
} from "../../Schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";

export default function ChangePassword({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onBlur",
  });
  const { userToken, setUserToken } = useContext(AuthContext);
  const { mutate, isPending } = useMutation({
    mutationFn: (values: { password: string; newPassword: string }) =>
      axios.patch(
        `https://route-posts.routemisr.com/users/change-password`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      ),
    onSuccess: (res) => {
     
      toast.success("Password updated");
      const newToken = res.data.data.token;

      localStorage.setItem("userToken", newToken);
      setUserToken(newToken);
      closeModal();
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update password");
    },
  });

  function onSubmit(values: ChangePasswordSchemaType) {
    // مش بنبعت rePassword للسيرفر
    mutate({
      password: values.password,
      newPassword: values.newPassword,
    });
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FaLock size={20} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Change Password
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep your account secure.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-lg p-2 cursor-pointer text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={closeModal}
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Form UI */}
          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Current Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  {...register("password")}
                />

                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  {...register("newPassword")}
                />

                {errors.newPassword && (
                  <p className="text-red-500">{errors.newPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  {...register("rePassword")}
                />
                {errors.rePassword && (
                  <p className="text-red-500">{errors.rePassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-xl cursor-pointer border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl  divide-slate-900 disabled:cursor-not-allowed cursor-pointer bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              {isPending ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                 
                  Update Password
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
