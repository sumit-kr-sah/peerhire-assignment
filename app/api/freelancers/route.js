import { freelancersData } from "@/data/freelancers";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(freelancersData);
} 