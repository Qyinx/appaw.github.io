"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Lock, Mail, ShieldCheck } from "lucide-react";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { graphqlFetch, graphqlConfig } from "@/lib/graphql";

const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        name
        roles
        mail
        phone
        created
      }
    }
  }
`;

interface LoginUser {
  id?: string;
  name?: string;
  roles?: string[] | string;
  mail?: string;
  phone?: string;
  created?: string;
}

interface LoginResponse {
  login?: {
    token?: string;
    user?: LoginUser;
  };
}

export default function AdministrationLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const endpoint = graphqlConfig.getEndpoint();
    if (!endpoint) {
      setError(t.auth.login.endpointMissing);
      return;
    }

    setLoading(true);
    try {
      const result = await graphqlFetch<LoginResponse>(LOGIN_MUTATION, {
        username,
        password,
      });

      const token = result?.data?.login?.token;
      const user = result?.data?.login?.user;

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0]?.message || "Request failed");
      }

      if (token) {
        localStorage.setItem("auth0_token", token);
        if (user) {
          localStorage.setItem("auth0_user", JSON.stringify(user));
        } else {
          localStorage.removeItem("auth0_user");
        }
        setMessage(t.auth.login.success);
        
        // Determine role and redirect to appropriate dashboard
        const roles = user?.roles;
        let role = 'admin'; // default
        if (Array.isArray(roles) && roles.length > 0) {
          role = roles[0];
        } else if (typeof roles === 'string') {
          role = roles;
        }
        
        setTimeout(() => router.push(`/business/grid-store/administration?role=${role}`), 600);
      } else {
        setError(t.auth.login.errorInvalid);
      }
    } catch (err) {
      console.error("Login error", err);
      setError(t.auth.login.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary-200">
            <ShieldCheck className="h-4 w-4" />
            {t.gridStoreAdmin.title}
          </div>
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{t.auth.login.title}</h1>
          <p className="mt-3 text-slate-200">{t.auth.login.subtitle}</p>
        </div>

        <div className="max-w-md mx-auto mt-10">
          <Card className="bg-white text-slate-900 shadow-2xl">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <LogIn className="h-5 w-5 text-primary-600" />
                {t.auth.login.title}
              </CardTitle>
              <CardDescription>{t.auth.login.helper}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">{t.auth.login.username}</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-slate-900 shadow-inner focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      placeholder="admin@example.com"
                    />
                  </div>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">{t.auth.login.password}</span>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-slate-900 shadow-inner focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      placeholder="••••••••"
                    />
                  </div>
                </label>

                {error && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
                    {message}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" />
                    {loading ? t.common.loading : t.auth.login.submit}
                  </div>
                </Button>
              </form>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <button
                  type="button"
                  className="font-semibold text-primary-600 hover:text-primary-700"
                  onClick={() => router.push("/business/grid-store/administration")}
                >
                  {t.auth.login.back}
                </button>
                <span>{t.gridStoreAdmin.dashboard.demoMode}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
