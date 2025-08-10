"use client";

import { memo } from "react";
import { AgeMod } from "@/app/types";
import DefaultInput from "@/app/components/default-input";
import { DefaultSelect } from "@/app/components/default-select";

interface LinkFormProps {
  url: string;
  setUrl: (url: string) => void;
  age: number;
  setAge: (age: number) => void;
  ageMod: AgeMod;
  setAgeMod: (ageMod: AgeMod) => void;
  urlError: string;
  ageError: string;
  createError: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LinkForm = ({
  url,
  setUrl,
  age,
  setAge,
  ageMod,
  setAgeMod,
  urlError,
  ageError,
  createError,
  loading,
  onSubmit,
}: LinkFormProps) => {
  const MAX_BY_MOD: Record<AgeMod, number> = {
    min: 43200, // 30일
    hr: 720, // 30일
    day: 30,
  };

  const getMaxAge = (mod: AgeMod) => {
    return MAX_BY_MOD[mod];
  };

  const ageMax = getMaxAge(ageMod);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <div className="space-y-1 flex flex-col">
        <label className="text-sm text-gray-600" htmlFor="url">
          Enter Long URL
        </label>
        <DefaultInput
          id="url"
          type="url"
          inputMode="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          isError={!!urlError}
          errorMessage={urlError}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600" htmlFor="age">
          Expiration
        </label>
        <div className="flex gap-2">
          <DefaultInput
            id="age"
            type="number"
            min={1}
            max={ageMax}
            value={age}
            onChange={(e) => {
              const newValue = Number(e.target.value) || 1;
              setAge(newValue);
            }}
            required
            className="flex-1"
            isError={!!ageError}
            errorMessage={ageError}
          />
          <DefaultSelect
            id="ageMod"
            value={ageMod}
            onChange={(e) => setAgeMod(e.target.value as AgeMod)}
            required
          >
            <option value="min">min</option>
            <option value="hr">hr</option>
            <option value="day">day</option>
          </DefaultSelect>
        </div>
        <p className="text-xs text-gray-500">
          * 총 만료시간은 30일을 초과할 수 없습니다.
        </p>
      </div>

      {createError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {createError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded-md bg-[#ffdd87] font-extrabold text-white py-2.5 shadow hover:bg-[#F9CE61] disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Link"}
      </button>
    </form>
  );
};

export default memo(LinkForm);
