BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[cognitive_level] (
    [id] INT NOT NULL IDENTITY(1,1),
    [level] VARCHAR(10) NOT NULL,
    CONSTRAINT [cognitive_level_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [cognitive_level_level_key] UNIQUE NONCLUSTERED ([level])
);

-- CreateTable
CREATE TABLE [dbo].[interaction] (
    [id] INT NOT NULL IDENTITY(1,1),
    [interaction_type] VARCHAR(30) NOT NULL,
    [interaction_response] VARCHAR(max) NOT NULL,
    [attempts] INT NOT NULL,
    [date] DATE NOT NULL CONSTRAINT [interaction_date_df] DEFAULT CURRENT_TIMESTAMP,
    [time_spent] TIME NOT NULL,
    [learning_material_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [interaction_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[labsheet] (
    [id] NVARCHAR(1000) NOT NULL,
    [supportMaterial] VARCHAR(max) NOT NULL,
    CONSTRAINT [labsheet_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[labsheet_question] (
    [id] INT NOT NULL IDENTITY(1,1),
    [question] VARCHAR(200) NOT NULL,
    [answer] VARCHAR(2000) NOT NULL,
    [example_question] VARCHAR(200) NOT NULL,
    [example_answer] VARCHAR(200) NOT NULL,
    [labsheet_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [labsheet_question_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[learner] (
    [id] NVARCHAR(1000) NOT NULL,
    [first_name] VARCHAR(30) NOT NULL,
    [last_name] VARCHAR(30) NOT NULL,
    [student_id] VARCHAR(10) NOT NULL,
    [email] VARCHAR(30) NOT NULL,
    [password] VARCHAR(60) NOT NULL,
    CONSTRAINT [learner_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [learner_student_id_key] UNIQUE NONCLUSTERED ([student_id]),
    CONSTRAINT [learner_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [learner_password_key] UNIQUE NONCLUSTERED ([password])
);

-- CreateTable
CREATE TABLE [dbo].[session] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [valid] BIT NOT NULL CONSTRAINT [session_valid_df] DEFAULT 1,
    [userAgent] NVARCHAR(1000) NOT NULL,
    [create_at] DATETIME2 NOT NULL CONSTRAINT [session_create_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [session_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[learning_material] (
    [id] NVARCHAR(1000) NOT NULL,
    [learning_level] VARCHAR(12) NOT NULL,
    [completion_status] DECIMAL(18,0) NOT NULL,
    [lesson_id] INT NOT NULL,
    [learner_id] NVARCHAR(1000) NOT NULL,
    [create_at] DATETIME2 NOT NULL CONSTRAINT [learning_material_create_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [learning_material_updated_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [learning_material_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[learning_outcome] (
    [id] INT NOT NULL IDENTITY(1,1),
    [description] VARCHAR(250) NOT NULL,
    CONSTRAINT [learning_outcome_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [learning_outcome_description_key] UNIQUE NONCLUSTERED ([description])
);

-- CreateTable
CREATE TABLE [dbo].[learning_outcome_cognitive_level] (
    [learning_outcome_id] INT NOT NULL,
    [cognitive_level_id] INT NOT NULL,
    CONSTRAINT [learning_outcome_cognitive_level_pkey] PRIMARY KEY CLUSTERED ([learning_outcome_id],[cognitive_level_id])
);

-- CreateTable
CREATE TABLE [dbo].[lecture] (
    [id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [lecture_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[lesson] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] VARCHAR(100) NOT NULL,
    [description] VARCHAR(2000) NOT NULL,
    [module_id] INT NOT NULL,
    CONSTRAINT [lesson_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[lesson_subtopic] (
    [id] INT NOT NULL IDENTITY(1,1),
    [topic] VARCHAR(200) NOT NULL,
    [description] VARCHAR(max) NOT NULL,
    [lesson_id] INT NOT NULL,
    CONSTRAINT [lesson_subtopic_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[lesson_learning_outcome] (
    [lesson_id] INT NOT NULL,
    [learning_outcome_id] INT NOT NULL,
    CONSTRAINT [lesson_learning_outcome_pkey] PRIMARY KEY CLUSTERED ([lesson_id],[learning_outcome_id])
);

-- CreateTable
CREATE TABLE [dbo].[module] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(20) NOT NULL,
    [description] VARCHAR(1000) NOT NULL,
    CONSTRAINT [module_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[sub_lecture] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] VARCHAR(50) NOT NULL,
    [content] VARCHAR(max),
    [lecture_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [sub_lecture_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[system_log] (
    [id] INT NOT NULL IDENTITY(1,1),
    [action] VARCHAR(30) NOT NULL,
    [timestamp] DATETIME NOT NULL CONSTRAINT [system_log_timestamp_df] DEFAULT getutcdate(),
    [learner_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [system_log_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[tutorial] (
    [id] NVARCHAR(1000) NOT NULL,
    [status] VARCHAR(20) NOT NULL,
    [current_question] INT NOT NULL CONSTRAINT [tutorial_current_question_df] DEFAULT 1,
    CONSTRAINT [tutorial_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[tutorial_question] (
    [id] INT NOT NULL IDENTITY(1,1),
    [question] VARCHAR(300) NOT NULL,
    [answer] VARCHAR(2000) NOT NULL,
    [tutorial_id] NVARCHAR(1000) NOT NULL,
    [question_number] INT NOT NULL,
    [type] VARCHAR(20) NOT NULL,
    [student_answer] VARCHAR(2000),
    [feedback_type] VARCHAR(10),
    [is_student_answer_correct] BIT,
    CONSTRAINT [tutorial_question_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[tutorial_question_option] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] VARCHAR(300) NOT NULL,
    [tutorialQuestionId] INT NOT NULL,
    CONSTRAINT [tutorial_question_option_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [description] ON [dbo].[learning_outcome]([description]);

-- AddForeignKey
ALTER TABLE [dbo].[interaction] ADD CONSTRAINT [FK__interacti__learn__7795AE5F] FOREIGN KEY ([learning_material_id]) REFERENCES [dbo].[learning_material]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[labsheet] ADD CONSTRAINT [labsheet_id_fkey] FOREIGN KEY ([id]) REFERENCES [dbo].[learning_material]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[labsheet_question] ADD CONSTRAINT [labsheet_question_labsheet_id_fkey] FOREIGN KEY ([labsheet_id]) REFERENCES [dbo].[labsheet]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[session] ADD CONSTRAINT [session_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[learner]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[learning_material] ADD CONSTRAINT [learning_material_learner_id_fkey] FOREIGN KEY ([learner_id]) REFERENCES [dbo].[learner]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[learning_material] ADD CONSTRAINT [learning_material_lesson_id_fkey] FOREIGN KEY ([lesson_id]) REFERENCES [dbo].[lesson]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[learning_outcome_cognitive_level] ADD CONSTRAINT [learning_outcome_cognitive_level_cognitive_level_id_fkey] FOREIGN KEY ([cognitive_level_id]) REFERENCES [dbo].[cognitive_level]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[learning_outcome_cognitive_level] ADD CONSTRAINT [learning_outcome_cognitive_level_learning_outcome_id_fkey] FOREIGN KEY ([learning_outcome_id]) REFERENCES [dbo].[learning_outcome]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[lecture] ADD CONSTRAINT [lecture_id_fkey] FOREIGN KEY ([id]) REFERENCES [dbo].[learning_material]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[lesson] ADD CONSTRAINT [lesson_module_id_fkey] FOREIGN KEY ([module_id]) REFERENCES [dbo].[module]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[lesson_subtopic] ADD CONSTRAINT [lesson_subtopic_lesson_id_fkey] FOREIGN KEY ([lesson_id]) REFERENCES [dbo].[lesson]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[lesson_learning_outcome] ADD CONSTRAINT [lesson_learning_outcome_learning_outcome_id_fkey] FOREIGN KEY ([learning_outcome_id]) REFERENCES [dbo].[learning_outcome]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[lesson_learning_outcome] ADD CONSTRAINT [lesson_learning_outcome_lesson_id_fkey] FOREIGN KEY ([lesson_id]) REFERENCES [dbo].[lesson]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[sub_lecture] ADD CONSTRAINT [sub_lecture_lecture_id_fkey] FOREIGN KEY ([lecture_id]) REFERENCES [dbo].[lecture]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[system_log] ADD CONSTRAINT [system_log_learner_id_fkey] FOREIGN KEY ([learner_id]) REFERENCES [dbo].[learner]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[tutorial] ADD CONSTRAINT [tutorial_id_fkey] FOREIGN KEY ([id]) REFERENCES [dbo].[learning_material]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[tutorial_question] ADD CONSTRAINT [tutorial_question_tutorial_id_fkey] FOREIGN KEY ([tutorial_id]) REFERENCES [dbo].[tutorial]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[tutorial_question_option] ADD CONSTRAINT [tutorial_question_option_tutorialQuestionId_fkey] FOREIGN KEY ([tutorialQuestionId]) REFERENCES [dbo].[tutorial_question]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
