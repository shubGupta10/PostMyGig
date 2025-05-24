import FeedbackModel from "@/models/FeedbackModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { name, email, feedback, feedbackType } = body;


    if (!name || !email || !feedback || !feedbackType) {
      console.log('Missing required fields:', { 
        name: !name, 
        email: !email, 
        feedback: !feedback, 
        feedbackType: !feedbackType 
      });
      return NextResponse.json(
        { error: 'Name, email, feedback, and feedbackType are required.' },
        { status: 400 }
      );
    }


    const userResponse = await FeedbackModel.create({
      name,
      email,
      feedback,
      feedbackType,
    });


    return NextResponse.json({ 
      message: 'Feedback saved successfully!', 
      userResponse 
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Something went wrong while saving your feedback.' },
      { status: 500 }
    );
  }
}