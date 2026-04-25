"use client";

import { useState } from "react";
import { CvUpload } from "@/components/form/CvUpload";
import { DifficultySelector } from "@/components/form/DifficultySelector";
import { ExperienceLevelSelect } from "@/components/form/ExperienceLevelSelect";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useGenerate } from "@/hooks/useGenerate";
import type { DifficultyMode, ExperienceLevel } from "@/types";

export function InterviewForm() {
  const [cv, setCv] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("MID");
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>("MEDIUM");
  const { submit, isLoading, error } = useGenerate();

  return (
    <form
      className="neu-raised rounded-xl p-card-padding w-full max-w-4xl flex flex-col gap-8 relative overflow-hidden"
      onSubmit={(event) => {
        event.preventDefault();
        void submit({ cv, jobDescription, experienceLevel, difficultyMode });
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full opacity-[0.03] blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <header className="flex flex-col items-center text-center gap-2 mb-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-surface-dim border border-white/5 mb-4 shadow-[0_0_15px_rgba(0,245,255,0.1)]">
          <Icon name="psychology" className="text-primary-fixed-dim" filled />
        </div>
        <h1 className="font-display-lg text-display-lg text-on-surface">AI Interview Question Generator</h1>
        <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">
          Configure the matrix parameters. Our neural synthesis engine will analyze your profile and role requirements
          to generate highly specific, challenging scenarios.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="space-y-2 flex flex-col">
          <Label icon="description" htmlFor="cv-input">
            Paste Your CV
          </Label>
          <CvUpload value={cv} onChange={setCv} />
        </div>
        <div className="space-y-2 flex flex-col">
          <Label icon="work" htmlFor="jd-input">
            Paste Job Description
          </Label>
          <Textarea
            id="jd-input"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the target job description, responsibilities, and required skills..."
            rows={10}
            style={{ minHeight: "200px" }}
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-gutter pt-4 border-t border-white/5 mt-2">
          <div className="space-y-2">
            <Label icon="trending_up" htmlFor="experience-level">
              Experience Level
            </Label>
            <ExperienceLevelSelect id="experience-level" value={experienceLevel} onChange={setExperienceLevel} />
          </div>
          <div className="space-y-2">
            <Label icon="speed" htmlFor="difficulty-mode">
              Interview Difficulty Mode
            </Label>
            <DifficultySelector id="difficulty-mode" value={difficultyMode} onChange={setDifficultyMode} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pt-8 mt-4 border-t border-white/5 relative gap-4">
        {error ? (
          <p className="font-body-sm text-body-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
        <Button variant="neon" size="lg" type="submit" disabled={isLoading} className="rounded-full px-12">
          <Icon name="model_training" filled />
          {isLoading ? "Generating..." : "Generate Questions"}
        </Button>
        {isLoading ? (
          <div className="flex flex-col items-center text-primary-fixed-dim gap-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-primary-fixed-dim rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-primary-fixed-dim rounded-full animate-pulse [animation-delay:75ms]" />
              <div className="w-2 h-2 bg-primary-fixed-dim rounded-full animate-pulse [animation-delay:150ms]" />
            </div>
            <p className="font-body-sm text-body-sm font-medium tracking-wide">
              Analyzing your CV and generating tailored interview questions…
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
